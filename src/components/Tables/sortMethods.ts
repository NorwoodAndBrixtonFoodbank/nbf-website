import { Database } from "@/databaseTypesFile";
import { SortOrder } from "react-data-table-component";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export type serverSideSortMethod<DbData extends Record<string, any>> = (
    query: PostgrestFilterBuilder<Database["public"], DbData, any>,
    sortDirection: SortOrder
) => PostgrestFilterBuilder<Database["public"], DbData, any>;

export type clientSideSortMethod = (sortDirection: SortOrder) => void;
