import supabase from "@/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { UserRole } from "@/databaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";
import { sendAuditLog } from "@/server/auditLog";

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
    const { data, error } = await supabase
        .from("profiles")
        .update({
            role: userDetails.role,
        })
        .eq("user_id", userDetails.userId)
        .select("profile_id:primary_key")
        .single();

    const auditLog = {
        action: "edit a user",
        content: {
            role: userDetails.role,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            phoneNumber: userDetails.phoneNumber,
        },
        userId: userDetails.userId,
    };

    if (error) {
        const logId = await logErrorReturnLogId(
            `Error with updating user profile: user id ${userDetails.userId}`,
            {
                error: error,
            }
        );
        await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
        return error;
    }

    await sendAuditLog({ ...auditLog, wasSuccess: true, profileId: data.profile_id });
    return null;
}
