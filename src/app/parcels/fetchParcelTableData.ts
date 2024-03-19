import { Supabase } from "@/supabaseUtils";
import { DatabaseError, EdgeFunctionError } from "../errorClasses";
import { ParcelsTableRow, processingDataToParcelsTableData } from "./getParcelsTableData";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { PostgrestQueryBuilder, PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { TableNames, ViewNames } from "@/databaseUtils";

export type CongestionChargeDetails = {
    postcode: string;
    congestionCharge: boolean;
};

export const getCongestionChargeDetailsForParcels = async (
    processingData: ParcelProcessingData,
    supabase: Supabase
): Promise<CongestionChargeDetails[]> => {
    const postcodes = [];
    for (const parcel of processingData) {
        postcodes.push(parcel.client_address_postcode);
    }

    const response = await supabase.functions.invoke("check-congestion-charge", {
        body: { postcodes: postcodes },
    });

    if (response.error) {
        throw new EdgeFunctionError("congestion charge check");
    }

    return response.data;
};

export type ParcelProcessingData = Awaited<ReturnType<typeof getParcelProcessingData>>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getParcelProcessingData = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[],
    sortState: SortState<ParcelsTableRow>,
    start?: number,
    end?: number,
    parcelIds?: string[]
) => {
    let query = supabase.from("parcels_plus").select("*");

    filters.forEach((filter) => {
        if (filter.methodConfig.methodType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    if (sortState.sort && sortState.column.sortMethodConfig?.methodType === PaginationType.Server) {
        query = sortState.column.sortMethodConfig.method(query, sortState.sortDirection);
    } else {
        query = query.order("packing_datetime", { ascending: false });
    }

    if (typeof start === "number" && typeof end === "number") {
        query = query.range(start, end);
    }

    if (parcelIds) {
        query = query.in("parcel_id", parcelIds);
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw new DatabaseError("fetch", "parcel table data");
    }
    return data ?? [];
};

export const getParcelsData = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any[]>[],
    sortState: SortState<ParcelsTableRow>,
    start?: number,
    end?: number,
    parcelIds?: string[]
): Promise<ParcelsTableRow[]> => {
    const processingData = await getParcelProcessingData(
        supabase,
        filters,
        sortState,
        start,
        end,
        parcelIds
    );
    const congestionCharge = await getCongestionChargeDetailsForParcels(processingData, supabase);
    const formattedData = processingDataToParcelsTableData(processingData, congestionCharge);

    return formattedData;
};

export const getParcelsCount = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[]
): Promise<number> => {
    let query = supabase.from("parcels_plus").select("*", { count: "exact", head: true });

    filters.forEach((filter) => {
        if (filter.methodConfig.methodType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    const { count, error } = await query;
    if (error || count === null) {
        console.error(error);
        throw new DatabaseError("fetch", "parcels");
    }
    return count;
};

export const getParcelIds = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[],
    sortState: SortState<ParcelsTableRow>
): Promise<string[]> => {
    let query = supabase.from("parcels_plus").select("*");
    filters.forEach((filter) => {
        if (filter.methodConfig.methodType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });
    if (sortState.sort && sortState.column.sortMethodConfig?.methodType === PaginationType.Server) {
        query = sortState.column.sortMethodConfig.method(query, sortState.sortDirection);
    } else {
        query = query.order("packing_datetime", { ascending: false });
    }
    const { data, error } = await query;
    if (error) {
        console.error(error);
        throw new DatabaseError("fetch", "parcels");
    }
    return data.map((parcel) => parcel.parcel_id ?? "") ?? [];
};

export const getAllValuesForKeys = async <Return>(
    supabase: Supabase,
    table: TableNames | ViewNames,
    selectMethod: (
        query: PostgrestQueryBuilder<Database["public"], any, any>
    ) => PostgrestFilterBuilder<Database["public"], any, any>
): Promise<Return> => {
    const query = selectMethod(supabase.from(table));
    const { data, error } = await query;
    if (error) {
        console.error(error);
        throw new DatabaseError("fetch", table);
    }
    return data ?? [];
};

export interface CollectionCentresOptions {
    name: string;
    acronym: string;
}
export interface StatusResponseRow {
    event_name: string;
}

export interface RequestParams<Data> {
    allFilters: Filter<Data, any>[];
    sortState: SortState<Data>;
    startPoint: number;
    endPoint: number;
}

export const isFreshRequest = <Data>(
    requestParams: RequestParams<Data>,
    initialRequestParams: RequestParams<Data>
): boolean => {
    const filtersSame = Array.from(requestParams.allFilters).every((filter, index) =>
        filter.areStatesIdentical(filter.state, initialRequestParams.allFilters[index].state)
    );
    const sortStateSame =
        requestParams.sortState.sort === initialRequestParams.sortState.sort &&
        requestParams.sortState.sort &&
        initialRequestParams.sortState.sort
            ? requestParams.sortState.sortDirection ===
                  initialRequestParams.sortState.sortDirection &&
              requestParams.sortState.column.sortField === requestParams.sortState.column.sortField
            : true;
    const startPointSame = requestParams.startPoint === initialRequestParams.startPoint;
    const endPointSame = requestParams.endPoint === initialRequestParams.endPoint;
    return filtersSame && sortStateSame && startPointSame && endPointSame;
};
