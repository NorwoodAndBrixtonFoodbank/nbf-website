import StyleManager from "@/app/themes";
import { Metadata } from "next";

import React from "react";
import NavigationBar from "@/components/NavBar/NavigationBar";
import { AuthRouting } from "@/app/auth";

interface Props {
    children: React.ReactNode;
}

const App: React.FC<Props> = ({ children }) => (
    <html lang="en">
        <body>
            <React.StrictMode>
                <AuthRouting>
                    <StyleManager>
                        <NavigationBar>{children}</NavigationBar>
                    </StyleManager>
                </AuthRouting>
            </React.StrictMode>
        </body>
    </html>
);

export const metadata: Metadata = {
    title: {
        template: "%s | Vauxhall Foodbank",
        default: "Vauxhall Foodbank",
    },
    description: "Providing foodbank services to clients in south London.",
};

export default App;
