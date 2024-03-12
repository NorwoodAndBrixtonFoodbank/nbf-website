import LoginPanel, { AuthMain } from "@/components/LoginPanel";
import React from "react";

const Login: React.FC<{}> = () => {
    return (
        <AuthMain>
            <LoginPanel />
        </AuthMain>
    );
};

export default Login;
