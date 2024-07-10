import { Database } from "@/databaseTypesFile";
import { SortOrder } from "react-data-table-component";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export type ServerSideSortMethod<DbData extends Record<string, unknown>> = (
    sortDirection: SortOrder,
    query: PostgrestFilterBuilder<Database["public"], DbData, unknown>
) => PostgrestFilterBuilder<Database["public"], DbData, unknown>;

export type ClientSideSortMethod = (sortDirection: SortOrder) => void;
