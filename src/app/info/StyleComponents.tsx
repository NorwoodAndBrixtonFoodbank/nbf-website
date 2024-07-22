"use client";

import { Paper } from "@mui/material";
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

export const StyledPaper = styled(Paper)`
    margin: 1rem;
    padding: 1rem;
    border-radius: 1rem;
    width: 90vw;
`;
