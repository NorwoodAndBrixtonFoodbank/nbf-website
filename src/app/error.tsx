"use client";
import React from "react";
import Button from "@mui/material/Button";
import styled from "styled-components";

interface ErrorProps {
    Error: Error;
    reset: () => void;
}

const Centerer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.main.background[0]};
    border-radius: 4rem;
    gap: 1rem;
    padding: 2rem;
    min-width: 20rem;
`;

const LargeText = styled.h1`
    font-size: 5rem;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Error: React.FC<ErrorProps> = ({ Error, reset }) => {
    return (
        <Centerer>
            <LargeText>OOPS!</LargeText>
            <h1>We could not fetch data at this time.</h1>
            <Button
                variant="outlined"
                onClick={() => {
                    reset();
                }}
            >
                Try again
            </Button>
        </Centerer>
    );
};

export default Error;
