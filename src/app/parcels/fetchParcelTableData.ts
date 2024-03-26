import { Supabase } from "@/supabaseUtils";
import { AbortError, DatabaseError, EdgeFunctionError } from "../errorClasses";
import { ParcelsTableRow, processingDataToParcelsTableData } from "./getParcelsTableData";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";

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
const getParcelsQuery = (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[],
    sortState: SortState<ParcelsTableRow>
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

    return query;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getParcelProcessingData = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[],
    sortState: SortState<ParcelsTableRow>,
    abortSignal: AbortSignal,
    startIndex: number,
    endIndex: number
) => {
    let query = getParcelsQuery(supabase, filters, sortState);
    query = query.range(startIndex, endIndex);
    query = query.abortSignal(abortSignal);

    const { data, error } = await query;

    if (error) {
        const logId = abortSignal.aborted
            ? await logInfoReturnLogId("Aborted fetch: parcel table", error)
            : await logErrorReturnLogId("Error with fetch: parcel table", error);

        if (abortSignal.aborted) {
            throw new AbortError("fetch", "parcel table", "logId");
        }
        throw new DatabaseError("fetch", "parcel table", logId);
    }

    return data;
};

export const getParcelsDataAndCount = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any[]>[],
    sortState: SortState<ParcelsTableRow>,
    abortSignal: AbortSignal,
    startIndex: number,
    endIndex: number
): Promise<{ data: ParcelsTableRow[]; count: number }> => {
    const processingData = await getParcelProcessingData(
        supabase,
        filters,
        sortState,
        abortSignal,
        startIndex,
        endIndex
    );
    const congestionCharge = await getCongestionChargeDetailsForParcels(processingData, supabase);
    const formattedData = await processingDataToParcelsTableData(processingData, congestionCharge);

    const count = await getParcelsCount(supabase, filters, abortSignal);

    return { data: formattedData, count };
};

const getParcelsCount = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[],
    abortSignal: AbortSignal
): Promise<number> => {
    let query = supabase.from("parcels_plus").select("*", { count: "exact", head: true });

    filters.forEach((filter) => {
        if (filter.methodConfig.paginationType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    query = query.abortSignal(abortSignal);

    const { count, error } = await query;

    if (error) {
        const logId = abortSignal.aborted
            ? await logInfoReturnLogId("Aborted fetch: parcel table count", error)
            : await logErrorReturnLogId("Error with fetch: parcel table count", error);
        if (abortSignal.aborted) {
            throw new AbortError("fetch", "parcel table", "logId");
        }

        throw new DatabaseError("fetch", "parcel table", logId);
    }

    if (count === null) {
        const logId = await logErrorReturnLogId("Error with fetch: Parcels, count is null");
        throw new DatabaseError("fetch", "parcels", logId);
    }
    return count;
};
export const getParcelIds = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[],
    sortState: SortState<ParcelsTableRow>
): Promise<string[]> => {
    const query = getParcelsQuery(supabase, filters, sortState);

    const { data, error } = await query;
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch", error);
        throw new DatabaseError("fetch", "parcels", logId);
    }

    return data.reduce<string[]>((reducedData, parcel) => {
        parcel.parcel_id && reducedData.push(parcel.parcel_id);
        return reducedData;
    }, []);
};

export const getParcelsByIds = async (
    supabase: Supabase,
    filters: Filter<ParcelsTableRow, any>[],
    sortState: SortState<ParcelsTableRow>,
    parcelIds: string[]
): Promise<ParcelsTableRow[]> => {
    let query = getParcelsQuery(supabase, filters, sortState);
    if (parcelIds) {
        query = query.in("parcel_id", parcelIds);
    }

    const { data, error } = await query;
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: parcel table", error);
        throw new DatabaseError("fetch", "parcel table", logId);
    }

    const congestionCharge = await getCongestionChargeDetailsForParcels(data, supabase);
    const formattedData = processingDataToParcelsTableData(data, congestionCharge);

    return formattedData;
};

export interface CollectionCentresOptions {
    name: string;
    acronym: string;
}
export interface StatusResponseRow {
    event_name: string;
}
