"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";
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
    const accessToken = useRef<string | null>(null);
    const refreshToken = useRef<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            accessToken.current = hashParams.get("access_token");
            refreshToken.current = hashParams.get("refresh_token");

            if (!accessToken.current) {
                void logErrorReturnLogId("Failed to validate new user: no access token");
                router.push("/");
            }
            if (!refreshToken.current) {
                void logErrorReturnLogId("Failed to validate new user: no refresh token");
                router.push("/");
            }

            const supabase = createClientComponentClient();
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                void logInfoReturnLogId(
                    "Session already exists when the invite link is visited. Logging the user out."
                );
                await supabase.auth.signOut();
            }
        })();
    }, [router]);

    const initiatePasswordUpdate = async (): Promise<void> => {
        setErrorMessage(null);

        if (!accessToken.current) {
            void logErrorReturnLogId(
                "Tried to set password without access token. The user should have been redirected."
            );
            setErrorMessage("Something went wrong. Please contact the admin.");
            return;
        }

        if (!refreshToken.current) {
            void logErrorReturnLogId(
                "Tried to set password without refresh token. The user should have been redirected."
            );
            setErrorMessage("Something went wrong. Please contact the admin.");
            return;
        }
        
        try {
            await signInWithTokens(accessToken.current, refreshToken.current);
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
