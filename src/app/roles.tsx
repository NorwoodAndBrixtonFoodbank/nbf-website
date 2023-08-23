"use client";

import React, { useState, createContext } from "react";

interface Props {
    children: React.ReactNode;
}

interface RolesInterface {
    [key: string]: string[];
}

export const rolesToHiddenPages: RolesInterface = {
    admin: [],
    caller: ["/admin", "/lists"],
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const RoleUpdateContext = createContext({ role: "", setRole: (role: string): void => {} });

export const RoleManager: React.FC<Props> = ({ children }) => {
    const [role, setRole] = useState("");

    return (
        <RoleUpdateContext.Provider value={{ role, setRole }}>
            {children}
        </RoleUpdateContext.Provider>
    );
};
