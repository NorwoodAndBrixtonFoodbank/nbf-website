import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { fetchUserRole } from "@/common/fetchUserRole";
import { logErrorReturnLogId } from "@/logger/logger";

type AuthenticationError = {
    error: string | null;
};

export async function errorsOnAuthentication(): Promise<AuthenticationError> {
    const serverComponentClient = getSupabaseServerComponentClient();

    const {
        data: { user },
        error: userError,
    } = await serverComponentClient.auth.getUser();

    if (userError) {
        return {
            error: "error fetching user",
        };
    }

    if (user === null) {
        return {
            error: "unauthorised",
        };
    }

    const userRole = await fetchUserRole(user.id, (error) => {
        return logErrorReturnLogId("Failed to fetch user role", error);
    });
    if (userRole !== "admin") {
        return {
            error: "forbidden",
        };
    }

    return { error: null };
}
