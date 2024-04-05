import supabase from "@/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { UserRole } from "@/databaseUtils";

type fetchRoleResult =
    | {
          role: UserRole;
          error: null;
      }
    | {
          role: null;
          error: PostgrestError;
      };
export const fetchUserRole = async (userId: string): Promise<fetchRoleResult> => {
    const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("primary_key", userId)
        .single();

    if (error) {
        return {
            role: null,
            error: error,
        };
    }

    return { role: data.role, error: null };
};
