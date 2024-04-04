import supabase from "@/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { UserRole } from "@/databaseUtils";

interface UpdateUserProfile {
    userId: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

export async function updateUserProfile(
    userDetails: UpdateUserProfile
): Promise<PostgrestError | null> {
    const { error } = await supabase
        .from("profiles")
        .update({
            role: userDetails.role,
        })
        .eq("primary_key", userDetails.userId)
        .select()
        .single();

    return error;
}
