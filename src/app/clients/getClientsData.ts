import { ClientsTableRow } from "@/app/clients/ClientsPage";
import { familyCountToFamilyCategory } from "@/app/parcels/getExpandedParcelDetails";
import { AbortError, DatabaseError } from "@/app/errorClasses";
import { Supabase } from "@/supabaseUtils";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";

const getClientsDataAndCount = async (
    supabase: Supabase,
    startIndex: number,
    endIndex: number,
    filters: Filter<ClientsTableRow, any>[],
    sortState: SortState<ClientsTableRow>,
    abortSignal: AbortSignal
): Promise<{ data: ClientsTableRow[]; count: number }> => {
    const data: ClientsTableRow[] = [];

    let query = supabase.from("clients_plus").select("*");

    if (
        sortState.sortEnabled &&
        sortState.column.sortMethodConfig?.paginationType === PaginationType.Server
    ) {
        query = sortState.column.sortMethodConfig.method(query, sortState.sortDirection);
    } else {
        query = query.order("full_name");
    }
    filters.forEach((filter) => {
        if (filter.methodConfig.paginationType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    query.order("client_id");

    query = query.range(startIndex, endIndex);

    query = query.abortSignal(abortSignal);

    const { data: clients, error: clientError } = await query;

    if (clientError) {
        const logId = abortSignal.aborted
            ? await logInfoReturnLogId("Aborted fetch: client table", clientError)
            : await logErrorReturnLogId("Error with fetch: client table", clientError);
        if (abortSignal.aborted) {
            throw new AbortError("fetch", "client table", "logId");
        }

        throw new DatabaseError("fetch", "client table", logId);
    }

    for (const client of clients) {
        if (!client.client_id) {
            const logId = await logErrorReturnLogId("Empty client ID");
            throw new Error("Empty client ID" + `Log ID: ${logId}`);
        }

        if (!client.full_name) {
            const logId = await logErrorReturnLogId("Empty client name");
            throw new Error("Empty client ID" + `Log ID: ${logId}`);
        }
        data.push({
            clientId: client.client_id ?? "",
            fullName: client.full_name ?? "",
            familyCategory: familyCountToFamilyCategory(client.family_count ?? 0),
            addressPostcode: client.address_postcode ?? "",
        });
    }

    const count = await getClientsCount(supabase, filters, abortSignal);

    return { data, count };
};

const getClientsCount = async (
    supabase: Supabase,
    filters: Filter<ClientsTableRow, any>[],
    abortSignal: AbortSignal
): Promise<number> => {
    let query = supabase.from("clients_plus").select("*", { count: "exact", head: true });

    filters.forEach((filter) => {
        if (filter.methodConfig.paginationType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    query = query.abortSignal(abortSignal);

    const { count, error: clientError } = await query;

    if (clientError || count === null) {
        const logId = abortSignal.aborted
            ? await logInfoReturnLogId("Aborted fetch: client table count")
            : await logErrorReturnLogId("Error with fetch: client table count");
        if (abortSignal.aborted) {
            throw new AbortError("fetch", "client table", "logId");
        }

        throw new DatabaseError("fetch", "client table", logId);
    }

    return count;
};

export default getClientsDataAndCount;
