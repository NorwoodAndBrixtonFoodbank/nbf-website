import { familyCountToFamilyCategory } from "@/app/clients/getExpandedClientDetails";
import { Supabase } from "@/supabaseUtils";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import {
    ClientsFilter,
    ClientsSortState,
    ClientsTableRow,
    GetClientsCountReturnType,
    GetClientsReturnType,
} from "./types";

const getClientsDataAndCount = async (
    supabase: Supabase,
    startIndex: number,
    endIndex: number,
    filters: ClientsFilter[],
    sortState: ClientsSortState,
    abortSignal: AbortSignal
): Promise<GetClientsReturnType> => {
    let query = supabase.from("clients_plus").select("*");

    if (sortState.sortEnabled && sortState.column.sortMethod) {
        query = sortState.column.sortMethod(query, sortState.sortDirection);
    } else {
        query = query.order("full_name");
    }
    filters.forEach((filter) => {
        query = filter.method(query, filter.state);
    });

    query.order("client_id");

    query = query.range(startIndex, endIndex);

    query = query.abortSignal(abortSignal);

    const { data: clients, error: clientError } = await query;

    if (clientError) {
        if (abortSignal.aborted) {
            const logId = await logInfoReturnLogId("Aborted fetch: client table", {
                error: clientError,
            });
            return { error: { type: "abortedFetchingClientsTable", logId }, data: null };
        }

        const logId = await logErrorReturnLogId("Error with fetch: client table", {
            error: clientError,
        });
        return { error: { type: "failedToFetchClientsTable", logId }, data: null };
    }

    const clientData: ClientsTableRow[] = clients.map((client) => {
        return {
            clientId: client.client_id ?? "",
            fullName: client.full_name ?? "",
            familyCategory: familyCountToFamilyCategory(client.family_count ?? 0),
            addressPostcode: client.address_postcode,
        };
    });

    const { data: clientCount, error: clientCountError } = await getClientsCount(
        supabase,
        filters,
        abortSignal
    );
    if (clientCountError) {
        return { data: null, error: clientCountError };
    }

    return { error: null, data: { clientData, count: clientCount } };
};

const getClientsCount = async (
    supabase: Supabase,
    filters: ClientsFilter[],
    abortSignal: AbortSignal
): Promise<GetClientsCountReturnType> => {
    let query = supabase.from("clients_plus").select("*", { count: "exact", head: true });

    filters.forEach((filter) => {
        query = filter.method(query, filter.state);
    });

    query = query.abortSignal(abortSignal);

    const { count, error: clientError } = await query;

    if (clientError || count === null) {
        if (abortSignal.aborted) {
            const logId = await logInfoReturnLogId("Aborted fetch: client table", {
                error: clientError,
            });
            return { error: { type: "abortedFetchingClientsTableCount", logId }, data: null };
        }

        const logId = await logErrorReturnLogId("Error with fetch: client table", {
            error: clientError,
        });
        return { error: { type: "failedToFetchClientsTableCount", logId }, data: null };
    }

    return { error: null, data: count };
};

export default getClientsDataAndCount;
