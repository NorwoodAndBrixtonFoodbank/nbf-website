"use client";

import { RoleUpdateContext } from "@/app/roles";
import { useContext } from "react";
import { StyledPaper } from "@/app/info/StyleComponents";

export interface Props {
    children: React.ReactNode;
}

export const AccordionSurface: React.FC<Props> = ({ children }) => {
    return <StyledPaper elevation={3}>{children}</StyledPaper>;
};

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
