import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { fetchUserRole } from "@/common/fetchUserRole";
import { logErrorReturnLogId } from "@/logger/logger";

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

    const userRole = await fetchUserRole(user.id, (error) => {
        return logErrorReturnLogId("Failed to fetch user role", error);
    });
    if (userRole !== "admin") {
        return {
            isSuccess: false,
            failureReason: "unauthorised",
        };
    }

    return { isSuccess: true, failureReason: null };
}
