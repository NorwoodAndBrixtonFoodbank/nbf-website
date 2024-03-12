import { ClientsTableRow } from "@/app/clients/ClientsPage";
import { familyCountToFamilyCategory } from "@/app/parcels/getExpandedParcelDetails";
import { DatabaseError } from "@/app/errorClasses";
import { Supabase } from "@/supabaseUtils";
import { Filter } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";

const getClientsData = async (
    supabase: Supabase,
    start: number,
    end: number,
    filters: Filter<ClientsTableRow, any>[],
    sortState: SortState<ClientsTableRow>
): Promise<ClientsTableRow[]> => {
    const data: ClientsTableRow[] = [];

    let query = supabase
        .from("clients")
        .select("primary_key, full_name, family_id, address_postcode", { count: "exact" });

    if (sortState.sort && sortState.column.sortMethod) {
        query = sortState.column.sortMethod(query, sortState.sortDirection);
    } else {
        query = query.order("full_name");
    }

    filters.forEach((filter) => {
        if (filter.methodConfig.methodType === "query") {
        query = filter.methodConfig.method(query, filter.state);}
    });

    query = query.range(start, end);

    const { data: clients, error: clientError } = await query;

    if (clientError) {
        throw new DatabaseError("fetch", "clients");
    }

    for (const client of clients) {
        const { count, error: familyError } = await supabase
            .from("families")
            .select("*", { count: "exact", head: true })
            .eq("family_id", client.family_id);

        if (familyError || count === null) {
            throw new DatabaseError("fetch", "families");
        }

        data.push({
            clientId: client.primary_key,
            fullName: client.full_name,
            familyCategory: familyCountToFamilyCategory(count),
            addressPostcode: client.address_postcode,
        });
    }

    return data;
};

export const getClientsCount = async (
    supabase: Supabase,
    filters: Filter<ClientsTableRow, any>[]
): Promise<number> => {
    let query = supabase.from("clients").select("*", { count: "exact", head: true });

    filters.forEach((filter) => {
        if (filter.methodConfig.methodType === "query") {
        query = filter.methodConfig.method(query, filter.state);}
    });
    const { count, error: clientError } = await query;
    if (clientError || count === null) {
        throw new DatabaseError("fetch", "clients");
    }
    return count;
};

export default getClientsData;
