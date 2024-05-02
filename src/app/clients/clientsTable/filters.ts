import { PaginationType } from "@/components/Tables/Filters";
import { buildTextFilter } from "@/components/Tables/TextFilter";
import { Database } from "@/databaseTypesFile";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import clientsHeaders from "./headers";
import { DBClientRow, ClientsFilter } from "./types";

type ClientsFilterMethod<State> = (
    query: PostgrestFilterBuilder<Database["public"], DBClientRow, any>,
    state: State
) => PostgrestFilterBuilder<Database["public"], DBClientRow, any>;

const fullNameSearch: ClientsFilterMethod<string> = (query, state) =>
    query.ilike("full_name", `%${state}%`);

const clientsFilters: ClientsFilter[] = [
    buildTextFilter({
        key: "fullName",
        label: "Name",
        headers: clientsHeaders,
        methodConfig: { paginationType: PaginationType.Server, method: fullNameSearch },
    }),
];

export default clientsFilters;
