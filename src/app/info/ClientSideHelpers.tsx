"use client";

import { RoleUpdateContext } from "@/app/roles";
import { useContext } from "react";

export const buttonAlert = (): void => {
    alert("Wiki item has been updated!");
};

interface RoleProps {
    children?: React.ReactNode;
}

export const AdminManagerDependent: React.FC<RoleProps> = (props) => {
    const { role } = useContext(RoleUpdateContext);

    return <>{(role === "admin" || role === "manager") && props.children}</>;
};
