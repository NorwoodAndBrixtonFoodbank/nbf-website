"use client";

import AuthPanel, { AuthLink, AuthMain } from "@/components/AuthPanel";
import React, { useState } from "react";
import { signInWithPassword } from "@/authentication/signIn";

const authLinks: AuthLink[] = [
    {
        label: "Forgot your password?",
        href: "/forgot-password",
    },
];

const Login: React.FC<{}> = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const signIn = (): void => {
        setErrorMessage(null)
        signInWithPassword({ email, password }).then(({ errorMessage }) => {
            setErrorMessage(errorMessage ?? null);
        });
    };

    return (
        <AuthMain>
            <AuthPanel
                emailField={{ text: email, setText: setEmail }}
                passwordField={{ text: password, setText: setPassword }}
                submitText="Sign in"
                submit={signIn}
                authLinks={authLinks}
                errorMessage={errorMessage ?? undefined}
            />
        </AuthMain>
    );
};

export default Login;
