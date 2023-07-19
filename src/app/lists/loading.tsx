"use client";

import { CircularProgress } from "@mui/material";
import React from "react";
import { styled } from "styled-components";

const Centerer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
`;

export const Loading: React.FC<{}> = () => {
    return (
        <Centerer>
            <CircularProgress />
        </Centerer>
    );
};

export default Loading;
