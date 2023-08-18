"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import styled from "styled-components";

interface ErrorProps {
    Error: Error;
    reset: () => void;
}
const Centerer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10vh;
`;
const Panel = styled.div`
    max-width: 450px;
    border-radius: 2rem;
    padding: 5rem;
    gap: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${(props) => props.theme.main.background[0]};
`;

const LargeText = styled.h1`
    font-size: 5rem;
`;

const SecondaryText = styled.h2`
    font-size: 1rem;
    text-align: center;
`;

const RetryText = styled.p`
    font-size: 0.75rem;
    color: ${(props) => props.theme.error};
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Error: React.FC<ErrorProps> = ({ Error, reset }) => {
    const [ErrorMessage, SetErrorMessage] = useState("");

    const retry = (): void => {
        SetErrorMessage("Retrying...");
        setTimeout(() => {
            reset();
        }, 1000);
    };
    return (
        <Centerer>
            <Panel>
                <LargeText>OOPS!</LargeText>
                <SecondaryText>We could not connect to the database at this time.</SecondaryText>
                <Button
                    variant="outlined"
                    onClick={() => {
                        retry();
                    }}
                >
                    Try again
                </Button>
                <RetryText>{ErrorMessage}</RetryText>
            </Panel>
        </Centerer>
    );
};

export default Error;
