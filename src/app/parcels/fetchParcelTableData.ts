import { Supabase } from "@/supabaseUtils";
import { AbortError, DatabaseError, EdgeFunctionError } from "../errorClasses";
import { ParcelsTableRow, processingDataToParcelsTableData } from "./getParcelsTableData";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";
import { ParcelStatus, ParcelsPlusRow, Schema } from "@/databaseUtils";

export type DBParcelRow = Schema["parcels"]
export type ParcelsFilter<state=any> = Filter<ParcelsTableRow, state, DBParcelRow>
export type ParcelsSortState = SortState<ParcelsTableRow, DBParcelRow>

export type CongestionChargeDetails = {
    postcode: string;
    congestionCharge: boolean;
};

export const getCongestionChargeDetailsForParcels = async (
    processingData: ParcelsPlusRow[],
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
    filters: ParcelsFilter[],
    sortState: ParcelsSortState
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
        query = query
            .order("packing_date", { ascending: false })
            .order("packing_slot_order")
            .order("client_full_name");
    }

    query = query.order("parcel_id");

    return query;
};

type GetDbParcelDataResult =
    | {
          parcels: ParcelsPlusRow[];
          error: null;
      }
    | {
          parcels: null;
          error: {
              type: GetDbParcelDataErrorType;
              logId: string;
          };
      };

type GetDbParcelDataErrorType = "abortedFetch" | "failedToFetchParcelTable";

const getParcelProcessingData = async (
    supabase: Supabase,
    filters: ParcelsFilter[],
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

type GetParcelDataAndCountResult =
    | {
          data: {
              parcelTableRows: ParcelsTableRow[];
              count: number;
          };
          error: null;
      }
    | {
          data: null;
          error: {
              type: GetParcelDataAndCountErrorType;
              logId: string;
          };
      };

export type GetParcelDataAndCountErrorType =
    | "unknownError"
    | "failedToFetchParcels"
    | "abortedFetch";

export const getParcelsDataAndCount = async (
    supabase: Supabase,
    filters:ParcelsFilter[],
    sortState: ParcelsSortState,
    abortSignal: AbortSignal,
    startIndex: number,
    endIndex: number
): Promise<GetParcelDataAndCountResult> => {
    const { parcels, error: getDbParcelsError } = await getParcelProcessingData(
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
    const { parcelTableRows, error } = await processingDataToParcelsTableData(
        parcels,
        congestionCharge
    );

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
    filters: ParcelsFilter[],
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
    filters: ParcelsFilter[],
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
    filters: ParcelsFilter[],
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
    const { parcelTableRows, error: processParcelDataError } =
        await processingDataToParcelsTableData(data, congestionCharge);

    if (processParcelDataError) {
        throw new Error("Failed to process parcels.", { cause: processParcelDataError });
    }

    return parcelTableRows;
};

export interface CollectionCentresOptions {
    name: string;
    acronym: string;
}
export interface StatusResponseRow {
    event_name: string;
}

type ParcelStatusesError = "failedToFetchStatuses";
type ParcelStatusesReturnType =
    | {
          data: ParcelStatus[];
          error: null;
      }
    | {
          data: null;
          error: { type: ParcelStatusesError; logId: string };
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
