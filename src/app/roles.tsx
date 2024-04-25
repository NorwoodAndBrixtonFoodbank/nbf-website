"use client";

import { UserRole } from "@/databaseUtils";
import React, { useState, createContext } from "react";

interface Props {
    children: React.ReactNode;
}

export const pathsNotRequiringLogin = [
    "/login",
    "/forgot-password",
    "/auth/reset-password",
    "/set-password",
] as const;

const pathsShownToAllAuthenticatedUsers = [
    "/calendar",
    "/clients",
    "/parcels",
    "/update-password",
    "/set-password",
] as const;

const pathsOnlyShownToStaffAndAbove = ["/lists"] as const;

const pathsOnlyShownToAdmin = ["/admin", "/lists"] as const;

const getShownPagesByRole = (role: UserRole | null): readonly string[] => {
    switch (role) {
        case "admin":
            return [
                ...pathsShownToAllAuthenticatedUsers,
                ...pathsOnlyShownToStaffAndAbove,
                ...pathsOnlyShownToAdmin,
            ];
        case "manager":
            return [...pathsShownToAllAuthenticatedUsers, ...pathsOnlyShownToStaffAndAbove];
        case "staff":
            return [...pathsShownToAllAuthenticatedUsers, ...pathsOnlyShownToStaffAndAbove];
        case "volunteer":
            return pathsShownToAllAuthenticatedUsers;
        case null:
            return pathsNotRequiringLogin;
    }
};

export const roleCanAccessPage = (role: UserRole | null, url: string): boolean => {
    const accessList = getShownPagesByRole(role);
    return accessList.some((page) => url.startsWith(page));
};

interface RoleUpdateContextType {
    role: UserRole | null;
    setRole: (_role: UserRole | null) => void;
}

export const RoleUpdateContext = createContext<RoleUpdateContextType>({
    role: null,
    setRole: (_role) => {},
});

export const RoleManager: React.FC<Props> = ({ children }) => {
    const [role, setRole] = useState<UserRole | null>(null);

    return (
        <RoleUpdateContext.Provider value={{ role, setRole }}>
            {children}
        </RoleUpdateContext.Provider>
    );
};
