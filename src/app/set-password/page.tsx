"use client";

import React, { ReactElement, useState } from "react";
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
    const router = useRouter();
    const supabase = createClientComponentClient();

    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')

    const initiatePasswordUpdate = async (): Promise<void> => {
        setErrorMessage(null);

        const {data} = await supabase.auth.getSession();
        if (data.session) {
            void logInfoReturnLogId("User logged out");
            await supabase.auth.signOut();
        }

        if (!accessToken) {
            setErrorMessage("No access token");
            return void logErrorReturnLogId("Failed to validate new user: no access token");
        } if (!refreshToken) {
            setErrorMessage("No refresh token");
            return void logErrorReturnLogId("Failed to validate new user: no refresh token");
        }
        
        try {
            await signInWithTokens(accessToken, refreshToken);
        }
        catch(error) {
            setErrorMessage("Failed to validate new user: please try again later")
            return
        }

        try {
            await updatePassword(password);
        }
        catch(error) {
            setErrorMessage("Failed to set password: please try again later")
            return
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
