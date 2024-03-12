"use client";

import AuthPanel, { AuthMain } from "@/components/AuthPanel";
import React, { useState } from "react";
import { signInWithPassword } from "@/server/signIn";

const Login: React.FC<{}> = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const signIn = (): void => {
        signInWithPassword({ email, password }).then(({ errorMessage }) => {
            setErrorMessage(errorMessage);
        });
    };

    return (
        <AuthMain>
            <AuthPanel
                emailField={{ text: email, setText: setEmail }}
                passwordField={{ text: password, setText: setPassword }}
                submitText="Sign in"
                submit={signIn}
                showForgotPasswordLink={true}
                errorMessage={errorMessage}
            />
        </AuthMain>
    );
};

export default Login;
