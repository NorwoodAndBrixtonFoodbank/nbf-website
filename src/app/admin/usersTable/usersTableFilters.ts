import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";

export const firstNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("first_name", `%${state}%`);
};

export const lastNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("last_name", `%${state}%`);
};

export const emailSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("email", `%${state}%`);
};
