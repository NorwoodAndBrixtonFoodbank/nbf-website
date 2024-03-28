import { errorsOnAuthentication } from "@/server/authenticateAdminUser";
import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { User } from "@supabase/gotrue-js";
import { UpdateUserDetails } from "@/app/admin/adminActions";

type UpdateUsersDataAndErrorType =
    | {
          data: User;
          error: null;
      }
    | {
          data: null;
          error: Record<string, any>;
      };
export async function adminUpdateUser(
    userDetails: UpdateUserDetails
): Promise<UpdateUsersDataAndErrorType> {
    const { error: authenticationError } = await errorsOnAuthentication();

    if (authenticationError) {
        return {
            data: null,
            error: { AuthError: authenticationError },
        };
    }

    const adminAuthClient = getSupabaseAdminAuthClient();

    const { data, error } = await adminAuthClient.updateUserById(
        userDetails.userId,
        userDetails.attributes
    );

    if (error) {
        return {
            data: null,
            error: { AuthError: `error updating user ${userDetails.attributes.email}` },
        };
    }

    return {
        data: data.user,
        error: null,
    };
}
