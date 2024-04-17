"use server";

import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { logErrorReturnLogId } from "@/logger/logger";
import { User } from "@supabase/gotrue-js";

type CurrentUserResponse =
    | {
          data: User;
          error: null;
      }
    | {
          data: null;
          error: CurrentUserError;
      };
type CurrentUserErrorType = "userFetchFailed" | "noMatchingUsers";
interface CurrentUserError {
    type: CurrentUserErrorType;
    logId: string;
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
    const supabase = getSupabaseServerComponentClient();

    const { data, error } = await supabase.auth.getUser();

    if (error) {
        const logId = await logErrorReturnLogId("error with auth getUser", error);
        return { data: null, error: { type: "userFetchFailed", logId: logId } };
    }

    if (data === null) {
        const logId = await logErrorReturnLogId("error with auth getUser: no matching users");
        return { data: null, error: { type: "noMatchingUsers", logId: logId } };
    }

    return { data: data.user, error: null };
}
