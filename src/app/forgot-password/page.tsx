"use client";

import React, { useState } from "react";
import AuthPanel, { AuthLink, AuthMain } from "@/components/AuthPanel";
import { requestPasswordReset } from "@/authentication/requestPasswordReset";

const authLinks: AuthLink[] = [
    {
        label: "Already have an account? Sign in",
        href: "/login",
    },
];

const Page: React.FC<{}> = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    // "Check your email for the password reset link"

    const sendResetPasswordInstructions = (): void => {
        setErrorMessage(undefined)
        const redirectUrl = `${window.location.origin}/reset-password`;
        requestPasswordReset(email, redirectUrl).then(({ errorMessage }) => {
            setErrorMessage(errorMessage);
        });
    };

    return (
        <AuthMain>
            <AuthPanel
                emailField={{ text: email, setText: setEmail }}
                submitText="Send reset password instructions"
                submit={sendResetPasswordInstructions}
                authLinks={authLinks}
                errorMessage={errorMessage}
            />
        </AuthMain>
    );
};

export default Page;
