import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/databaseTypesFile";

export const fetchUserRole = async (
    userId: string,
    logError?: (error: PostgrestError) => Promise<string>
): Promise<Database["public"]["Enums"]["role"]> => {
    const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("primary_key", userId)
        .single();

    if (error) {
        if (logError) {
            const logId = await logError(error);
            throw new DatabaseError("fetch", "profile for user", logId);
        } else {
            throw new DatabaseError("fetch", "profile for user");
        }
    }

    return data.role;
};
