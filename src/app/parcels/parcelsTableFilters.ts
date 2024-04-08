"use client";

import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { DateRangeState } from "@/components/DateRangeInputs/DateRangeInputs";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { ParcelsTableRow } from "@/app/parcels/getParcelsTableData";
import { dateFilter } from "@/components/Tables/DateFilter";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";
import { checklistFilter } from "@/components/Tables/ChecklistFilter";
import { CollectionCentresOptions } from "@/app/parcels/fetchParcelTableData";
import { Dayjs } from "dayjs";

interface packingSlotOptionsSet {
    key: string;
    value: string;
}

const getDbDate = (dateTime: Dayjs): string => dateTime.format("YYYY-MM-DD");

export const fullNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("client_full_name", `%${state}%`);
};

export const postcodeSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("client_address_postcode", `%${state}%`);
};

export const familySearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
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

export const phoneSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("client_phone_number", `%${state}%`);
};

export const voucherSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("voucher_number", `%${state}%`);
};

export const buildDateFilter = (
    initialState: DateRangeState
): Filter<ParcelsTableRow, DateRangeState> => {
    const dateSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: DateRangeState
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
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

export const buildDeliveryCollectionFilter = async (): Promise<
    Filter<ParcelsTableRow, string[]>
> => {
    const deliveryCollectionSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
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
        filterLabel: "Collection",
        itemLabelsAndKeys: optionsSet.map((option) => [option!.name, option!.acronym]),
        initialCheckedKeys: optionsSet.map((option) => option!.acronym),
        methodConfig: { paginationType: PaginationType.Server, method: deliveryCollectionSearch },
    });
};

export const buildLastStatusFilter = async (): Promise<Filter<ParcelsTableRow, string[]>> => {
    const lastStatusSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
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

    return checklistFilter<ParcelsTableRow>({
        key: "lastStatus",
        filterLabel: "Last Status",
        itemLabelsAndKeys: optionsSet.map((value) => [value, value]),
        initialCheckedKeys: optionsSet.filter((option) => option !== "Request Deleted"),
        methodConfig: { paginationType: PaginationType.Server, method: lastStatusSearch },
    });
};

export const buildPackingSlotFilter = async (): Promise<Filter<ParcelsTableRow, string[]>> => {
    const packingSlotSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
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

    return checklistFilter<ParcelsTableRow>({
        key: "packingSlot",
        filterLabel: "Packing Slot",
        itemLabelsAndKeys: optionsSet.map((option) => [option.value, option.key]),
        initialCheckedKeys: optionsSet.map((option) => option.key),
        methodConfig: { paginationType: PaginationType.Server, method: packingSlotSearch },
    });
};
