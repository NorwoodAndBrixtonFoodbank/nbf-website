"use client";

import { Database } from "@/databaseTypesFile";
import { DateRangeState } from "@/components/DateRangeInputs/DateRangeInputs";
import { PaginationType } from "@/components/Tables/Filters";
import { dateFilter } from "@/components/Tables/DateFilter";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";
import { checklistFilter } from "@/components/Tables/ChecklistFilter";
import { getDbDate, nullPostcodeDisplay } from "@/common/format";
import { CollectionCentresOptions, DbParcelRow, ParcelsFilter, ParcelsFilterMethod, ParcelsTableRow, packingSlotOptionsSet } from "./types";

export const fullNameSearch: ParcelsFilterMethod<string> = (query, state) =>
    query.ilike("client_full_name", `%${state}%`);

export const postcodeSearch: ParcelsFilterMethod<string> = (query, state) => {
    if (state === "") {
        return query;
    }
    if (nullPostcodeDisplay.toLowerCase().includes(state.toLowerCase())) {
        return query.or(
            `client_address_postcode.ilike.%${state}%, client_address_postcode.is.null`
        );
    }
    return query.ilike("client_address_postcode", `%${state}%`);
};

export const familySearch: ParcelsFilterMethod<string> = (query, state) => {
    if (state === "") {
        return query;
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
        return query.lte("family_count", 1);
    }
    return query.eq("family_count", Number(state));
};

export const phoneSearch: ParcelsFilterMethod<string> = (query, state) =>
    query.ilike("client_phone_number", `%${state}%`);

export const voucherSearch: ParcelsFilterMethod<string> = (query, state) =>
    query.ilike("voucher_number", `%${state}%`);

export const buildDateFilter = (initialState: DateRangeState): ParcelsFilter<DateRangeState> => {
    const dateSearch: ParcelsFilterMethod<DateRangeState> = (query, state) => {
        return query
            .gte("packing_date", getDbDate(state.from))
            .lte("packing_date", getDbDate(state.to));
    };
    return dateFilter<ParcelsTableRow>({
        key: "packingDate",
        label: "",
        methodConfig: { paginationType: PaginationType.Server, method: dateSearch },
        initialState: initialState,
    });
};

export const buildDeliveryCollectionFilter = async (): Promise<ParcelsFilter<string[]>> => {
    const deliveryCollectionSearch: ParcelsFilterMethod<string[]> = (query, state) => {
        return query.in("collection_centre_acronym", state);
    };

    const keySet = new Set();
    const { data, error } = await supabase
        .from("parcels_plus")
        .select("collection_centre_name, collection_centre_acronym");
    if (error) {
        const logId = await logErrorReturnLogId(
            "Error with fetch: Collection centre filter options",
            error
        );
        throw new DatabaseError("fetch", "collection centre filter options", logId);
    }
    const optionsResponse = data ?? [];
    const optionsSet: CollectionCentresOptions[] = optionsResponse.reduce<
        CollectionCentresOptions[]
    >((filteredOptions, row) => {
        if (
            row?.collection_centre_acronym &&
            row.collection_centre_name &&
            !keySet.has(row.collection_centre_acronym)
        ) {
            keySet.add(row.collection_centre_acronym);
            filteredOptions.push({
                name: row.collection_centre_name,
                acronym: row.collection_centre_acronym,
            });
        }
        return filteredOptions.sort();
    }, []);

    return checklistFilter<ParcelsTableRow>({
        key: "deliveryCollection",
        filterLabel: "Method",
        itemLabelsAndKeys: optionsSet.map((option) => [option!.name, option!.acronym]),
        initialCheckedKeys: optionsSet.map((option) => option!.acronym),
        methodConfig: { paginationType: PaginationType.Server, method: deliveryCollectionSearch },
    });
};

export const buildLastStatusFilter = async (): Promise<ParcelsFilter<string[]>> => {
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

    return checklistFilter<ParcelsTableRow, DbParcelRow>({
        key: "lastStatus",
        filterLabel: "Last Status",
        itemLabelsAndKeys: optionsSet.map((value) => [value, value]),
        initialCheckedKeys: optionsSet.filter((option) => option !== "Request Deleted"),
        methodConfig: { paginationType: PaginationType.Server, method: lastStatusSearch },
    });
};

export const buildPackingSlotFilter = async (): Promise<ParcelsFilter<string[]>> => {
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

    return checklistFilter<ParcelsTableRow, DbParcelRow>({
        key: "packingSlot",
        filterLabel: "Packing Slot",
        itemLabelsAndKeys: optionsSet.map((option) => [option.value, option.key]),
        initialCheckedKeys: optionsSet.map((option) => option.key),
        methodConfig: { paginationType: PaginationType.Server, method: packingSlotSearch },
    });
};
