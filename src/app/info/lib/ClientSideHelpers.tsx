"use client";

import { RoleUpdateContext } from "@/app/roles";
import { Props } from "@/components/Tables/TableSurface";
import { Paper } from "@mui/material";
import { useContext } from "react";
import styled from "styled-components";

export const AccordionWrapper = styled.div`
    display: flex;
    justify-content: center;
    min-width: 100%;
`;

export const WikiUpdateButton = styled.button`
    border: none;
    background-color: rgba(0, 0, 0, 0);
    &:hover {
        color: lightgray;
        cursor: pointer;
    }
`;

const StyledPaper = styled(Paper)`
    margin: 1rem;
    padding: 1rem;
    border-radius: 1rem;
    width: 90vw;
`;

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
