import { ClientsTableRow } from "@/app/clients/ClientsPage";
import { familyCountToFamilyCategory } from "@/app/parcels/getExpandedParcelDetails";
import { DatabaseError } from "@/app/errorClasses";
import { Supabase } from "@/supabaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { logError } from "@/logger/logger";

const getClientsData = async (
    supabase: Supabase,
    startIndex: number,
    endIndex: number,
    filters: Filter<ClientsTableRow, any>[],
    sortState: SortState<ClientsTableRow>
): Promise<ClientsTableRow[]> => {
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

    query = query.range(startIndex, endIndex);

    const { data: clients, error: clientError } = await query;

    if (clientError) {
        const logId = await logErrorReturnLogId("Error with fetch: Clients", clientError);
        throw new DatabaseError("fetch", "clients", logId);
    }

    for (const client of clients) {
        if (!client.client_id) {
          const logId = await logErrorReturnLogId("Empty client ID");
          throw new Error("Empty client ID" + `Log ID: ${logId}`;
        }
      
        if (!client.full_name) {
            const logId = await logErrorReturnLogId("Empty client name");
            throw new Error("Empty client ID" + `Log ID: ${logId}`;

        }
        data.push({
            clientId: client.client_id ?? "",
            fullName: client.full_name ?? "",
            familyCategory: familyCountToFamilyCategory(client.family_count ?? 0),
            addressPostcode: client.address_postcode ?? "",
        });
    }

    return data;
};

export const getClientsCount = async (
    supabase: Supabase,
    filters: Filter<ClientsTableRow, any>[]
): Promise<number> => {
    let query = supabase.from("clients_plus").select("*", { count: "exact", head: true });

    filters.forEach((filter) => {
        if (filter.methodConfig.paginationType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });
    const { count, error: clientError } = await query;
    if (clientError || count === null) {
        void logError("error fetching clients details");
        throw new DatabaseError("fetch", "clients");
    }
    return count ?? 0;
};

export default getClientsData;
