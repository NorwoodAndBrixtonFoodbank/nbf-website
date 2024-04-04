"use client";

import { DatabaseEnums } from "@/databaseUtils";
import React, { useState, createContext } from "react";
import { pathsNotRequiringLogin } from "./auth";

interface Props {
    children: React.ReactNode;
}

type Roles = DatabaseEnums["role"] | "";

type RolesInterface = {
    [key in Roles]: readonly string[];
};

const pathsShownToCaller = [
    "/calendar",
    "/clients",
    "/parcels",
    "/update-password",
    "/set-password",
];

const roleToShownPages: RolesInterface = {
    admin: pathsShownToCaller.concat("/admin", "/lists"),
    caller: pathsShownToCaller,
    "": pathsNotRequiringLogin,
};

export const roleCanAccessPage = (role: Roles, url: string): boolean => {
    const accessList = roleToShownPages[role];
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
