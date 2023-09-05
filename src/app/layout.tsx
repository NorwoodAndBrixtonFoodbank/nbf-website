import StyleManager from "@/app/themes";
import { Metadata } from "next";
import React from "react";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { AuthRouting } from "@/app/auth";
import Localization from "@/app/Localization";
import { RoleManager } from "@/app/roles";

interface Props {
    children: React.ReactNode;
}

const App: React.FC<Props> = ({ children }) => (
    <html lang="en">
        <body>
            <React.StrictMode>
                <RoleManager>
                    <AuthRouting>
                        <StyleManager>
                            <NavigationBar>
                                <Localization>{children}</Localization>
                            </NavigationBar>
                        </StyleManager>
                    </AuthRouting>
                </RoleManager>
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
