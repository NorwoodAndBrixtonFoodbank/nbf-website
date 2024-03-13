"use client";

import React, { ReactElement, useState } from "react";
import AuthPanel, { AuthMain } from "@/components/AuthPanel";
import { updatePassword } from "@/authentication/updatePassword";

export default function Page(): ReactElement {
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const initiatePasswordUpdate = (): void => {
        setErrorMessage(null);
        setSuccessMessage(null);

        updatePassword(password).then(({ errorMessage }) => {
            if (errorMessage) {
                setErrorMessage(errorMessage);
            } else {
                setSuccessMessage("Password has been reset!");
            }
        });
    };

    return (
        <AuthMain>
            <AuthPanel
                title={"Update password"}
                emailField={null}
                passwordField={{ text: password, setText: setPassword }}
                submitText="Update password"
                onSubmit={initiatePasswordUpdate}
                authLinks={[]}
                errorMessage={errorMessage}
                successMessage={successMessage}
            />
        </AuthMain>
    );
}
