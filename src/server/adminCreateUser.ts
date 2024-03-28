import { errorsOnAuthentication } from "@/server/authenticateAdminUser";
import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { User } from "@supabase/gotrue-js";
import { CreateUserDetails } from "@/app/admin/createUser/CreateUserForm";

type CreateUsersDataAndErrorType =
    | {
          data: User;
          error: null;
      }
    | {
          data: null;
          error: Record<string, any>;
      };
export async function adminCreateUser(
    userDetails: CreateUserDetails
): Promise<CreateUsersDataAndErrorType> {
    const { error: authenticationError } = await errorsOnAuthentication();

    if (authenticationError) {
        return {
            data: null,
            error: { AuthError: authenticationError },
        };
    }

    const adminAuthClient = getSupabaseAdminAuthClient();
    const { data, error } = await adminAuthClient.createUser({
        email: userDetails.email,
        password: userDetails.password,
        app_metadata: {
            role: userDetails.role,
        },
        email_confirm: true,
    });

    if (error) {
        return {
            data: null,
            error: { AuthError: `error creating user ${userDetails.email}` },
        };
    }

    return {
        data: data.user,
        error: null,
    };
}
