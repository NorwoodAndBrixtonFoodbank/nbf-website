"use client";

import AuthPanel, { AuthLink, AuthMain } from "@/components/AuthPanel";
import React, { ReactElement, useState } from "react";
import { signInWithPassword } from "@/authentication/signIn";

const linksToDisplay: AuthLink[] = [
    {
        label: "Forgot your password?",
        href: "/forgot-password",
    },
];

export default function Login(): ReactElement {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const initiateSignIn = (): void => {
        setErrorMessage(null);
        signInWithPassword({ email, password }).then(({ errorMessage }) => {
            setErrorMessage(errorMessage);
        });
    };

    return (
        <AuthMain>
            <AuthPanel
                title="Login"
                emailField={{ text: email, setText: setEmail }}
                passwordField={{ text: password, setText: setPassword }}
                submitText="Sign in"
                onSubmit={initiateSignIn}
                authLinks={linksToDisplay}
                errorMessage={errorMessage}
                successMessage={null}
            />
        </AuthMain>
    );
}
