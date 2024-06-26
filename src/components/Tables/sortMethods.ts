import { Database } from "@/databaseTypesFile";
import { SortOrder } from "react-data-table-component";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export type ServerSideSortMethod<DbData extends Record<string, unknown>> = (
    query: PostgrestFilterBuilder<Database["public"], DbData, any>,
    sortDirection: SortOrder
) => PostgrestFilterBuilder<Database["public"], DbData, any>;

export type ClientSideSortMethod = (sortDirection: SortOrder) => void;
