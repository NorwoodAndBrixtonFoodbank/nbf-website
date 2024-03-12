import { redirect } from "next/navigation";
import { logError } from "@/logger/logger";
import { getSupabaseServerComponentClient } from "@/supabaseServer";

export async function GET(request: Request): Promise<void> {
    const supabase = getSupabaseServerComponentClient()
    const { searchParams } = new URL(request.url);
    const authCode = searchParams.get("code");

    if (!authCode) {
        void logError("Reset password route was visited without authorisation code.");
        redirect("/");
    }

    const { error, data } = await supabase.auth.exchangeCodeForSession(authCode);

    if (error) {
        void logError(
            "Failed to exchange authorisation code for a session when resetting password."
        );
        redirect("/");
    }

    redirect("/reset-password");
}
