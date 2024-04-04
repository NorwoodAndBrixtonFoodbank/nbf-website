import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { fetchUserRole } from "@/common/fetchUserRole";
import { logErrorReturnLogId } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";

type Authenticated =
    | {
          isSuccess: true;
          failureReason: null;
      }
    | {
          isSuccess: false;
          failureReason: FailureReason;
      };

type FailureReason = "unauthenticated" | "unauthorised" | "fetch user error";

export async function authenticateAsAdmin(): Promise<Authenticated> {
    const serverComponentClient = getSupabaseServerComponentClient();

    const {
        data: { user },
        error: userError,
    } = await serverComponentClient.auth.getUser();

    if (userError) {
        return {
            isSuccess: false,
            failureReason: "fetch user error",
        };
    }

    if (user === null) {
        return {
            isSuccess: false,
            failureReason: "unauthenticated",
        };
    }

    const { role: userRole, error } = await fetchUserRole(user.id);

    if (error) {
        const logId = await logErrorReturnLogId(
            `Failed to fetch user role to authenticate as admin ${user.id}`,
            error
        );
        throw new DatabaseError("fetch", "user role for admin authorisation", logId);
    }

    if (userRole !== "admin") {
        return {
            isSuccess: false,
            failureReason: "unauthorised",
        };
    }

    return { isSuccess: true, failureReason: null };
}
