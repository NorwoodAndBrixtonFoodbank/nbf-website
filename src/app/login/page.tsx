import LoginPanel from "@/components/LoginPanel";
import React from "react";
import Title from "@/components/Title/Title";

const Login: React.FC<{}> = () => {
    return (
        <main>
            <Title>Login</Title>
            <LoginPanel />
        </main>
    );
};

export default Login;
