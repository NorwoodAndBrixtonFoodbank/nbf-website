import supabase from "@/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { UserRole } from "@/databaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";
import { sendAuditLog } from "@/server/auditLog";

interface UpdateUserProfile {
    profileId: string;
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
        .eq("primary_key", userDetails.profileId)
        .single();

    const auditLog = {
        action: "edit a user",
        content: {
            role: userDetails.role,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            phoneNumber: userDetails.phoneNumber,
        },
        profileId: userDetails.profileId,
    };

    if (error) {
        const logId = await logErrorReturnLogId(
            `Error with updating profiles: profile id ${userDetails.profileId}`,
            {
                error: error,
            }
        );
        await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
        return error;
    }

    await sendAuditLog({ ...auditLog, wasSuccess: true });
    return null;
}
