"use client";

import { DateRangeState } from "@/components/DateInputs/DateRangeInputs";
import { serverSideDateFilter } from "@/components/Tables/DateFilter";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";
import { serverSideChecklistFilter } from "@/components/Tables/ChecklistFilter";
import { getDbDate } from "@/common/format";
import {
    CollectionCentresOptions,
    ParcelsFilter,
    ParcelsFilterMethod,
    ParcelsFilters,
    ParcelsTableRow,
    packingSlotOptionsSet,
} from "./types";
import { buildServerSideTextFilter } from "@/components/Tables/TextFilter";
import dayjs from "dayjs";
import { parcelTableHeaderKeysAndLabels } from "./headers";
import { DbParcelRow } from "@/databaseUtils";
import { fullNameSearch, phoneSearch, postcodeSearch } from "@/common/databaseFilters";

const parcelsFullNameSearch: ParcelsFilterMethod<string> = fullNameSearch<DbParcelRow>(
    "client_full_name",
    "client_is_active"
);

const parcelsPostcodeSearch: ParcelsFilterMethod<string> = postcodeSearch<DbParcelRow>(
    "client_address_postcode",
    "client_is_active"
);

const familySearch: ParcelsFilterMethod<string> = (query, state) => {
    if (state === "") {
        return query;
    }
    if (state === "-") {
        return query.eq("client_is_active", false);
    }
    if ("single".includes(state.toLowerCase())) {
        return query.lte("family_count", 1);
    }
    if ("family of".includes(state.toLowerCase())) {
        return query.gte("family_count", 2);
    }
    const stateAsNumber = Number(state);
    if (Number.isNaN(stateAsNumber) || stateAsNumber === 0) {
        return query.eq("family_count", -1);
    }
    if (stateAsNumber >= 10) {
        return query.gte("family_count", 10);
    }
    if (stateAsNumber === 1) {
        return query.eq("family_count", 1);
    }
    return query.eq("family_count", Number(state));
};

const parcelsPhoneSearch: ParcelsFilterMethod<string> = phoneSearch<DbParcelRow>(
    "client_phone_number",
    "client_is_active"
);

const voucherSearch: ParcelsFilterMethod<string> = (query, state) => {
    if (state === "?") {
        return query.ilike("voucher_number", "");
    }
    return query.ilike("voucher_number", `%${state}%`);
};

const buildDateFilter = (initialState: DateRangeState): ParcelsFilter<DateRangeState> => {
    const dateSearch: ParcelsFilterMethod<DateRangeState> = (query, state) => {
        return query
            .gte("packing_date", getDbDate(state.from))
            .lte("packing_date", getDbDate(state.to));
    };
    return serverSideDateFilter<ParcelsTableRow, DbParcelRow>({
        key: "packingDate",
        label: "",
        method: dateSearch,
        initialState: initialState,
    });
};

const buildDeliveryCollectionFilter = async (): Promise<ParcelsFilter<string[]>> => {
    const deliveryCollectionSearch: ParcelsFilterMethod<string[]> = (query, state) => {
        return query.in("collection_centre_acronym", state);
    };

    const { data: collection_centres, error } = await supabase
        .from("collection_centres")
        .select("name, acronym, is_shown");
    if (error) {
        console.error(error);
        const logId = await logErrorReturnLogId(
            "Error with fetch: Collection centre filter options",
            error
        );
        throw new DatabaseError("fetch", "collection centre filter options", logId);
    }
    const optionsSet: CollectionCentresOptions[] = collection_centres.map((row) => ({
        key: row.acronym,
        value: row.is_shown ? row.name : `${row.name} (inactive)`,
    }));

    return serverSideChecklistFilter<ParcelsTableRow, DbParcelRow>({
        key: "deliveryCollection",
        filterLabel: "Method",
        itemLabelsAndKeys: optionsSet.map((option) => [option.value, option.key]),
        initialCheckedKeys: optionsSet.map((option) => option.key),
        method: deliveryCollectionSearch,
    });
};

const buildLastStatusFilter = async (): Promise<ParcelsFilter<string[]>> => {
    const lastStatusSearch: ParcelsFilterMethod<string[]> = (query, state) => {
        if (state.includes("None")) {
            return query.or(
                `last_status_event_name.is.null,last_status_event_name.in.(${state.join(",")})`
            );
        } else {
            return query.in("last_status_event_name", state);
        }
    };

    const keySet = new Set();
    const { data, error } = await supabase.from("status_order").select("event_name");
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Last status filter options");
        throw new DatabaseError("fetch", "last status filter options", logId);
    }
    const optionsResponse = data ?? [];
    const optionsSet: string[] = optionsResponse.reduce<string[]>((filteredOptions, row) => {
        if (row.event_name && !keySet.has(row.event_name)) {
            keySet.add(row.event_name);
            filteredOptions.push(row.event_name);
        }
        return filteredOptions.sort();
    }, []);
    data && optionsSet.push("None");

    return serverSideChecklistFilter<ParcelsTableRow, DbParcelRow>({
        key: "lastStatus",
        filterLabel: "Last Status",
        itemLabelsAndKeys: optionsSet.map((value) => [value, value]),
        initialCheckedKeys: optionsSet.filter(
            (option) => option !== "Request Deleted" && option !== "Parcel Deleted"
        ),
        method: lastStatusSearch,
    });
};

const buildPackingSlotFilter = async (): Promise<ParcelsFilter<string[]>> => {
    const packingSlotSearch: ParcelsFilterMethod<string[]> = (query, state) => {
        return query.in("packing_slot_name", state);
    };

    const keySet = new Set();

    const { data, error } = await supabase.from("packing_slots").select("name, is_shown");
    if (error) {
        const logId = await logErrorReturnLogId(
            "Error with fetch: Packing slot filter options",
            error
        );
        throw new DatabaseError("fetch", "packing slot filter options", logId);
    }

    const optionsResponse = data ?? [];

    const optionsSet = optionsResponse.reduce<packingSlotOptionsSet[]>((filteredOptions, row) => {
        if (!row.name || keySet.has(row.name)) {
            return filteredOptions;
        }

        if (row.is_shown) {
            keySet.add(row.name);
            filteredOptions.push({ key: row.name, value: row.name });
        } else {
            keySet.add(row.name);
            filteredOptions.push({ key: row.name, value: `${row.name} (inactive)` });
        }

        return filteredOptions;
    }, []);

    optionsSet.sort();

    return serverSideChecklistFilter<ParcelsTableRow, DbParcelRow>({
        key: "packingSlot",
        filterLabel: "Packing Slot",
        itemLabelsAndKeys: optionsSet.map((option) => [option.value, option.key]),
        initialCheckedKeys: optionsSet.map((option) => option.key),
        method: packingSlotSearch,
    });
};

const buildFilters = async (): Promise<{
    primaryFilters: ParcelsFilters;
    additionalFilters: ParcelsFilters;
}> => {
    const today = dayjs();
    const dateFilter = buildDateFilter({
        from: today,
        to: today,
    });
    const primaryFilters: ParcelsFilters = [
        dateFilter,
        buildServerSideTextFilter({
            key: "fullName",
            label: "Name",
            headers: parcelTableHeaderKeysAndLabels,
            method: parcelsFullNameSearch,
        }),
        buildServerSideTextFilter({
            key: "addressPostcode",
            label: "Postcode",
            headers: parcelTableHeaderKeysAndLabels,
            method: parcelsPostcodeSearch,
        }),
        await buildDeliveryCollectionFilter(),
    ];

    const additionalFilters: ParcelsFilters = [
        buildServerSideTextFilter({
            key: "familyCategory",
            label: "Family",
            headers: parcelTableHeaderKeysAndLabels,
            method: familySearch,
        }),
        buildServerSideTextFilter({
            key: "phoneNumber",
            label: "Phone",
            headers: parcelTableHeaderKeysAndLabels,
            method: parcelsPhoneSearch,
        }),
        buildServerSideTextFilter({
            key: "voucherNumber",
            label: "Voucher",
            headers: parcelTableHeaderKeysAndLabels,
            method: voucherSearch,
        }),
        await buildLastStatusFilter(),
        await buildPackingSlotFilter(),
    ];
    return { primaryFilters: primaryFilters, additionalFilters: additionalFilters };
};

export default buildFilters;
