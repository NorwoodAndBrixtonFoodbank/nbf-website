import LoginPanel, { LoginMain } from "@/components/LoginPanel";
import React from "react";

const Login: React.FC<{}> = () => {
    return (
        <LoginMain>
            <LoginPanel />
        </LoginMain>
    );
};

export default Login;
