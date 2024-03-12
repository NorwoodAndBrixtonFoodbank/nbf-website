import React from "react";
import LoginPanel, { AuthMain } from "@/components/LoginPanel";

const Page: React.FC<{}> = () => {
    return (
        <AuthMain>
            <LoginPanel />
        </AuthMain>
    );
};

export default Page;
