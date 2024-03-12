"use client";

import { DatabaseEnums } from "@/databaseUtils";
import React, { useState, createContext } from "react";

interface Props {
    children: React.ReactNode;
}

type Roles = DatabaseEnums["role"] | "";

type RolesInterface = {
    [key in Roles]: string[];
};

const roleToShownPages: RolesInterface = {
    admin: ["/admin", "/calendar", "/clients", "/lists", "/parcels", "/reset-password"],
    caller: ["/calendar", "/clients", "/parcels", "/reset-password"],
    "": ["/login", "/forgot-password", "/auth/reset-password"],
};

export const roleCanAccessPage = (role: Roles, url: string): boolean => {
    const accessList = roleToShownPages[role] ?? [];
    return accessList.some((page) => url.startsWith(page));
};

interface RoleUpdateContextType {
    role: Roles;
    setRole: (_role: Roles) => void;
}

export const RoleUpdateContext = createContext<RoleUpdateContextType>({
    role: "",
    setRole: (_role) => {},
});

export const RoleManager: React.FC<Props> = ({ children }) => {
    const [role, setRole] = useState<Roles>("");

    return (
        <RoleUpdateContext.Provider value={{ role, setRole }}>
            {children}
        </RoleUpdateContext.Provider>
    );
};
