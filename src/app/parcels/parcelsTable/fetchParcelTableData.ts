import { Supabase } from "@/supabaseUtils";
import { AbortError, DatabaseError, EdgeFunctionError } from "../../errorClasses";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";
import { DbParcelRow } from "@/databaseUtils";
import {
    CongestionChargeDetails,
    FetchClientIdResult,
    GetDbParcelDataResult,
    GetParcelDataAndCountErrorType,
    GetParcelDataAndCountResult,
    ParcelStatusesReturnType,
    ParcelsFilters,
    ParcelsSortState,
    ParcelsTableRow,
} from "./types";
import convertParcelDbtoParcelRow from "./convertParcelDBtoParcelRow";

export const getCongestionChargeDetailsForParcels = async (
    processingData: DbParcelRow[],
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getParcelsQuery = (
    supabase: Supabase,
    filters: ParcelsFilters,
    sortState: ParcelsSortState
) => {
    let query = supabase.from("parcels_plus").select("*");

    filters.forEach((filter) => {
        query = filter.method(query, filter.state);
    });

    if (sortState.sortEnabled && sortState.column.sortMethod) {
        query = sortState.column.sortMethod(query, sortState.sortDirection);
    } else {
        query = query
            .order("packing_date", { ascending: false })
            .order("packing_slot_order")
            .order("client_full_name");
    }

    query = query.order("parcel_id");

    return query;
};

const fetchParcelsDbRows = async (
    supabase: Supabase,
    filters: ParcelsFilters,
    sortState: ParcelsSortState,
    abortSignal: AbortSignal,
    startIndex: number,
    endIndex: number
): Promise<GetDbParcelDataResult> => {
    let query = getParcelsQuery(supabase, filters, sortState);
    query = query.range(startIndex, endIndex);
    query = query.abortSignal(abortSignal);

    const { data, error } = await query;

    if (error) {
        const logId = abortSignal.aborted
            ? await logInfoReturnLogId("Aborted fetch: parcel table", error)
            : await logErrorReturnLogId("Error with fetch: parcel table", error);

        return {
            parcels: null,
            error: {
                type: abortSignal.aborted ? "abortedFetch" : "failedToFetchParcelTable",
                logId,
            },
        };
    }

    return {
        parcels: data,
        error: null,
    };
};

export const getParcelsDataAndCount = async (
    supabase: Supabase,
    filters: ParcelsFilters,
    sortState: ParcelsSortState,
    abortSignal: AbortSignal,
    startIndex: number,
    endIndex: number
): Promise<GetParcelDataAndCountResult> => {
    const { parcels, error: getDbParcelsError } = await fetchParcelsDbRows(
        supabase,
        filters,
        sortState,
        abortSignal,
        startIndex,
        endIndex
    );

    if (getDbParcelsError) {
        let errorType: GetParcelDataAndCountErrorType;
        switch (getDbParcelsError.type) {
            case "abortedFetch":
                errorType = "abortedFetch";
                break;
            case "failedToFetchParcelTable":
                errorType = "failedToFetchParcels";
                break;
        }

        return {
            data: null,
            error: {
                type: errorType,
                logId: getDbParcelsError.logId,
            },
        };
    }

    const congestionCharge = await getCongestionChargeDetailsForParcels(parcels, supabase);
    const { parcelTableRows, error } = await convertParcelDbtoParcelRow(parcels, congestionCharge);

    if (error) {
        switch (error.type) {
            case "invalidInputLengths":
                return {
                    data: null,
                    error: {
                        type: "unknownError",
                        logId: error.logId,
                    },
                };
        }
    }

    const count = await getParcelsCount(supabase, filters, abortSignal);

    return {
        data: {
            parcelTableRows,
            count,
        },
        error: null,
    };
};

const getParcelsCount = async (
    supabase: Supabase,
    filters: ParcelsFilters,
    abortSignal: AbortSignal
): Promise<number> => {
    let query = supabase.from("parcels_plus").select("*", { count: "exact", head: true });

    filters.forEach((filter) => {
        query = filter.method(query, filter.state);
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
    filters: ParcelsFilters,
    sortState: ParcelsSortState
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
    filters: ParcelsFilters,
    sortState: ParcelsSortState,
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
    const { parcelTableRows, error: processParcelDataError } = await convertParcelDbtoParcelRow(
        data,
        congestionCharge
    );

    if (processParcelDataError) {
        throw new Error("Failed to process parcels.", { cause: processParcelDataError });
    }

    return parcelTableRows;
};

export const fetchParcelStatuses = async (): Promise<ParcelStatusesReturnType> => {
    const { data: parcelStatusesListData, error: statusOrderError } = await supabase
        .from("status_order")
        .select("event_name")
        .order("workflow_order");

    if (statusOrderError) {
        const logId = await logErrorReturnLogId("failed to fetch statuses", {
            error: statusOrderError,
        });
        return { data: null, error: { type: "failedToFetchStatuses", logId } };
    }

    const parcelStatusesList = parcelStatusesListData.map((status) => {
        return status.event_name;
    });

    return { data: parcelStatusesList, error: null };
};

export const getClientIdForParcel = async (parcelId: string): Promise<FetchClientIdResult> => {
    const { data: clientIdData, error: clientIdError } = await supabase
        .from("parcels")
        .select("client_id")
        .eq("primary_key", parcelId)
        .single();

    if (clientIdError) {
        const message = `Failed to fetch client ID for a parcel with ID ${parcelId}`;
        const logId = await logErrorReturnLogId(message, { error: clientIdError });
        return { clientId: null, error: { type: "failedClientIdFetch", logId: logId } };
    }

    return { clientId: clientIdData.client_id, error: null };
};
