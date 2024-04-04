"use server";

import { authenticateAsAdmin } from "@/server/authenticateAdminUser";
import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { User } from "@supabase/gotrue-js";
import { CreateUserDetails } from "@/app/admin/createUser/CreateUserForm";
import supabase from "@/supabaseClient";
import { logInfoReturnLogId } from "@/logger/logger";

type CreateUsersDataAndErrorType =
    | {
          data: User;
          error: null;
      }
    | {
          data: null;
          error: Record<string, string>;
      };

export async function adminCreateUser(
    userDetails: CreateUserDetails
): Promise<CreateUsersDataAndErrorType> {
    const { isSuccess, failureReason } = await authenticateAsAdmin();

    if (!isSuccess) {
        return {
            data: null,
            error: { "Failed to authenticate as admin": failureReason },
        };
    }

    const adminAuthClient = getSupabaseAdminAuthClient();
    const { data, error } = await adminAuthClient.createUser({
        email: userDetails.email,
        password: userDetails.password,
        email_confirm: true,
    });

    if (error) {
        return {
            data: null,
            error: { AuthError: `error creating user ${userDetails.email}` },
        };
    }

    if (data) {
        const { error: createRoleError } = await supabase.from("profiles").insert({
            primary_key: data.user.id,
            role: userDetails.role,
            first_name: userDetails.firstName,
            last_name: userDetails.lastName,
            telephone_number: userDetails.telephoneNumber,
        });
        if (createRoleError) {
            return {
                data: null,
                error: { Error: `error creating user profile for user ${userDetails.email}` },
            };
        }
        void logInfoReturnLogId(
            `Created a profile for ${userDetails.role} user: ${userDetails.email}`
        );
    }

    return {
        data: data.user,
        error: null,
    };
}
