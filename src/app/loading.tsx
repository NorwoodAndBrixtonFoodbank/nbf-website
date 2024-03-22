"use client";

import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Centerer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
`;

const Loading: React.FC<{}> = () => {
    return (
        <main>
            <Centerer>
                <CircularProgress aria-label="waiting for page load" />
            </Centerer>
        </main>
    );
};

export default Loading;
