import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { fetchUserRole } from "@/common/fetchUserRole";
import { logErrorReturnLogId } from "@/logger/logger";

type Authenticated =
    | {
          isSuccess: true;
          reason: null;
      }
    | {
          isSuccess: false;
          reason: FailureReason;
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
            reason: "fetch user error",
        };
    }

    if (user === null) {
        return {
            isSuccess: false,
            reason: "unauthenticated",
        };
    }

    const userRole = await fetchUserRole(user.id, (error) => {
        return logErrorReturnLogId("Failed to fetch user role", error);
    });
    if (userRole !== "admin") {
        return {
            isSuccess: false,
            reason: "unauthorised",
        };
    }

    return { isSuccess: true, reason: null };
}
