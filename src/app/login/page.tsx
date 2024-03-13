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
                authLinks={authLinks}
                errorMessage={errorMessage}
                successMessage={null}
            />
        </AuthMain>
    );
};

export default Login;
