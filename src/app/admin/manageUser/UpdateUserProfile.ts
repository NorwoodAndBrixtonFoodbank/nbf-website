import supabase from "@/supabaseClient";
import { Roles } from "@/app/roles";
import { PostgrestError } from "@supabase/supabase-js";

interface UpdateUserProfile {
    userId: string;
    role: Roles;
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

    if (error) {
        console.log(error);
    }
    return error;
}
