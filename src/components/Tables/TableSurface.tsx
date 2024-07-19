"use client";

import React from "react";
import styled from "styled-components";
import { Paper } from "@mui/material";

const StyledPaper = styled(Paper)`
    margin: 1rem;
    padding: 1rem;
    border-radius: 1rem;
`;

export interface Props {
    children: React.ReactNode;
}

const TableSurface: React.FC<Props> = ({ children }) => {
    return <StyledPaper elevation={3}>{children}</StyledPaper>;
};

export default TableSurface;
