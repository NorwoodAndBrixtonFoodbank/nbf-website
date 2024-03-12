import React from "react";
import AuthPanel, { AuthMain } from "@/components/AuthPanel";

const Page: React.FC<{}> = () => {
    return (
        <AuthMain>
            <AuthPanel />
        </AuthMain>
    );
};

export default Page;
