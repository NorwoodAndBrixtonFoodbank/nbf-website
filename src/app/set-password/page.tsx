"use client";

import React, { ReactElement, useEffect, useState } from "react";
import AuthPanel, { AuthMain } from "@/components/AuthPanel";
import { updatePassword } from "@/authentication/updatePassword";
import { useRouter } from "next/navigation";
import { signInWithTokens } from "@/authentication/signIn";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthError } from "@supabase/gotrue-js";

export default function Page(): ReactElement {
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const supabase = createClientComponentClient();

            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get("access_token");
            const refreshToken = hashParams.get("refresh_token");

            if (!accessToken) {
                logErrorReturnLogId("Failed to validate new user: no access token");
                router.push("/");
            }
            if (!refreshToken) {
                logErrorReturnLogId("Failed to validate new user: no refresh token");
                router.push("/");
            }

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            const { data } = await supabase.auth.getSession();
            if (data.session) {
                void logInfoReturnLogId("User logged out");
                await supabase.auth.signOut();
            }
        })();
    }, [router]);

    const initiatePasswordUpdate = async (): Promise<void> => {
        setErrorMessage(null);

        try {
            await signInWithTokens(accessToken!, refreshToken!);
        } catch (error) {
            if (error instanceof AuthError) {
                setErrorMessage(error.message);
            }
            return;
        }

        try {
            await updatePassword(password);
        } catch (error) {
            if (error instanceof AuthError) {
                setErrorMessage(error.message);
            }
            return;
        }

        router.push("/");
    };

    return (
        <AuthMain>
            <AuthPanel
                title="Set password"
                emailField={null}
                passwordField={{ text: password, setText: setPassword }}
                submitText="Set password"
                onSubmit={initiatePasswordUpdate}
                errorMessage={errorMessage}
                successMessage={null}
            />
        </AuthMain>
    );
}
