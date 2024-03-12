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
    const [errorMessage, setErrorMessage] = useState<string | null>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const sendResetPasswordInstructions = (): void => {
        setSuccessMessage(null);
        setErrorMessage(null);

        const redirectUrl = `${window.location.origin}/auth/reset-password`;
        requestPasswordReset(email, redirectUrl).then(({ errorMessage }) => {
            if (errorMessage) {
                setErrorMessage(errorMessage);
            } else {
                setSuccessMessage("Check your email for the password reset link");
            }
        });
    };

    return (
        <AuthMain>
            <AuthPanel
                emailField={{ text: email, setText: setEmail }}
                submitText="Send reset password instructions"
                submit={sendResetPasswordInstructions}
                authLinks={authLinks}
                errorMessage={errorMessage ?? undefined}
                successMessage={successMessage ?? undefined}
            />
        </AuthMain>
    );
};

export default Page;
