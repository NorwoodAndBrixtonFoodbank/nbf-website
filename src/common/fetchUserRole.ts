import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { PostgrestError } from "@supabase/supabase-js";
import { UserRole } from "@/databaseUtils";

export const fetchUserRole = async (
    userId: string,
    logErrorAndReturnLogId?: (error: PostgrestError) => Promise<string>
): Promise<UserRole> => {
    const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("primary_key", userId)
        .single();

    if (error) {
        if (logErrorAndReturnLogId) {
            const logId = await logErrorAndReturnLogId(error);
            throw new DatabaseError("fetch", "profile for user", logId);
        } else {
            throw new DatabaseError("fetch", "profile for user");
        }
    }

    return data.role;
};
