import { Supabase } from "@/supabaseUtils";
import { DatabaseError, EdgeFunctionError } from "../errorClasses";
import { logErrorReturnLogId } from "@/logger/logger";
import { ParcelsTableRow, processingDataToParcelsTableData } from "./getParcelsTableData";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { logError } from "@/logger/logger";

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
        const logId = await logErrorReturnLogId(
            "Error with congestion charge check",
            response.error
        );
        throw new EdgeFunctionError("congestion charge check", logId);
    }
    return response.data;
};

export type ParcelProcessingData = Awaited<ReturnType<typeof getParcelProcessingData>>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getParcelProcessingData = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[],
    sortState: SortState<ParcelsTableRow>,
    startIndex?: number,
    endIndex?: number,
    parcelIds?: string[]
) => {
    let query = supabase.from("parcels_plus").select("*");

    filters.forEach((filter) => {
        if (filter.methodConfig.paginationType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    if (
        sortState.sortEnabled &&
        sortState.column.sortMethodConfig?.paginationType === PaginationType.Server
    ) {
        query = sortState.column.sortMethodConfig.method(query, sortState.sortDirection);
    } else {
        query = query.order("packing_datetime", { ascending: false });
    }

    if (typeof startIndex === "number" && typeof endIndex === "number") {
        query = query.range(startIndex, endIndex);
    }

    if (parcelIds) {
        query = query.in("parcel_id", parcelIds);
    }

    const { data, error } = await query;

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: parcel table", error);
        throw new DatabaseError("fetch", "parcel table", logId);
    }

    return data;
};

export const getParcelsData = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any[]>[],
    sortState: SortState<ParcelsTableRow>,
    startIndex?: number,
    endIndex?: number,
    parcelIds?: string[]
): Promise<ParcelsTableRow[]> => {
    const processingData = await getParcelProcessingData(
        supabase,
        filters,
        sortState,
        startIndex,
        endIndex,
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
        if (filter.methodConfig.paginationType === PaginationType.Server) {
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
        if (filter.methodConfig.paginationType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    if (
        sortState.sortEnabled &&
        sortState.column.sortMethodConfig?.paginationType === PaginationType.Server
    ) {
        query = sortState.column.sortMethodConfig.method(query, sortState.sortDirection);
    } else {
        query = query.order("packing_datetime", { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
        console.error(error);
        throw new DatabaseError("fetch", "parcels");
    }

    return data.reduce<string[]>((reducedData, parcel) => {
        parcel.parcel_id && reducedData.push(parcel.parcel_id);
        return reducedData;
    }, []);
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

export const areRequestsIdentical = <Data>(
    requestParamsA: RequestParams<Data>,
    requestParamsB: RequestParams<Data>
): boolean => {
    const filtersSame = Array.from(requestParamsA.allFilters).every((filter, index) =>
        filter.areStatesIdentical(filter.state, requestParamsB.allFilters[index].state)
    );
    const sortStateSame =
        requestParamsA.sortState.sortEnabled === requestParamsB.sortState.sortEnabled &&
        requestParamsA.sortState.sortEnabled &&
        requestParamsB.sortState.sortEnabled
            ? requestParamsA.sortState.sortDirection === requestParamsB.sortState.sortDirection &&
              requestParamsA.sortState.column.sortField ===
                  requestParamsA.sortState.column.sortField
            : true;
    const startPointSame = requestParamsA.startPoint === requestParamsB.startPoint;
    const endPointSame = requestParamsA.endPoint === requestParamsB.endPoint;
    return filtersSame && sortStateSame && startPointSame && endPointSame;
};
