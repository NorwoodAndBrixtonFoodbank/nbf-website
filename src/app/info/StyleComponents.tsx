"use client";

import { Paper } from "@mui/material";
import styled from "styled-components";
import React from "react";

export const WikiItemPositioner = styled.div`
    display: flex;
    justify-content: center;
    min-width: 100%;
`;

export const WikiItemDetailsTextBreaker = styled.div`
    word-break: break-all;
    white-space: pre-line;
`;

export const WikiUpdateDataButton = styled.button`
    border: none;
    background-color: rgba(0, 0, 0, 0);
    &:hover {
        color: lightgray;
        cursor: pointer;
    }
`;

export const ReorderArrowDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
`;

export const StyledPaper = styled(Paper)`
    margin: 1rem;
    padding: 1rem;
    border-radius: 1rem;
    width: 90vw;
`;

export const WikiEditModeButton = styled.button`
    title: "wiki edit mode button";
    margin-top: 0.5rem;
    border: none;
    background-color: rgba(0, 0, 0, 0);
    &:hover {
        color: lightgray;
        cursor: pointer;
    }
`;

export interface Props {
    children: React.ReactNode;
}

export const WikiItemAccordionSurface: React.FC<Props> = ({ children }) => {
    return <StyledPaper elevation={3}>{children}</StyledPaper>;
};

export const MultilineInput = styled.div`
    margin: 1rem;
    width: 100vw;
`;

export const ButtonMargin = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
`;
