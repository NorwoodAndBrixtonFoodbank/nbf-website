"use server";

import { authenticateAsAdmin } from "@/server/authenticateAdminUser";
import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { User } from "@supabase/gotrue-js";
import { InviteUserDetails } from "@/app/admin/createUser/CreateUserForm";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import { AuditLog, sendAuditLog } from "@/server/auditLog";

export type InviteUserErrorType =
    | "adminAuthenticationFailure"
    | "inviteUserFailure"
    | "createProfileFailure";

export interface InviteUserError {
    type: InviteUserErrorType;
    logId: string;
}

type InviteUsersDataAndErrorType =
    | {
          data: User;
          error: null;
      }
    | {
          data: null;
          error: InviteUserError;
      };

export async function adminInviteUser(
    userDetails: InviteUserDetails,
    redirectUrl: string
): Promise<InviteUsersDataAndErrorType> {
    const { isSuccess, failureReason } = await authenticateAsAdmin();

    if (!isSuccess) {
        const logId = await logErrorReturnLogId("Error with authenticating admin", {
            error: failureReason,
        });
        return {
            data: null,
            error: { type: "adminAuthenticationFailure", logId: logId },
        };
    }

    const adminAuthClient = getSupabaseAdminAuthClient();
    const { data, error } = await adminAuthClient.inviteUserByEmail(userDetails.email, {
        redirectTo: redirectUrl,
    });

    const auditLog = {
        action: "send invite link to user by email",
        content: {
            email: userDetails.email,
        },
    } as const satisfies Partial<AuditLog>;

    if (error) {
        const logId = await logErrorReturnLogId("failed to invite user", { error: error });
        await sendAuditLog({
            ...auditLog,
            wasSuccess: false,
            logId,
        });
        return {
            data: null,
            error: { type: "inviteUserFailure", logId: logId },
        };
    }

    await sendAuditLog({
        ...auditLog,
        wasSuccess: true,
        content: {
            ...auditLog.content,
            newUserId: data.user.id,
            invitedAt: data.user.invited_at,
            createdAt: data.user.created_at,
        },
    });

    if (data) {
        const { data: profileData, error: createRoleError } = await supabase
            .from("profiles")
            .insert({
                primary_key: data.user.id,
                role: userDetails.role,
                first_name: userDetails.firstName,
                last_name: userDetails.lastName,
                telephone_number: userDetails.telephoneNumber,
            })
            .select()
            .single();

        const auditLog = {
            action: "add a profile for user",
            content: {
                email: userDetails.email,
            },
        } as const satisfies Partial<AuditLog>;

        if (createRoleError) {
            const logId = await logErrorReturnLogId("failed to create profile for user", {
                error: error,
            });
            await sendAuditLog({
                ...auditLog,
                wasSuccess: false,
                logId,
            });
            return {
                data: null,
                error: { "Failed to create user profile": createRoleError.message },
            };
        }

        await sendAuditLog({
            ...auditLog,
            wasSuccess: true,
            content: { ...auditLog.content, profile: profileData },
            profileId: data.user.id,
        });

        void logInfoReturnLogId(
            `Created a profile for ${userDetails.role} user: ${userDetails.email}`
        );
    }
    void logInfoReturnLogId(`Created a profile for ${userDetails.role} user: ${userDetails.email}`);

    return {
        data: data.user,
        error: null,
    };
}
