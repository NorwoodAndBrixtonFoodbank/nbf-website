"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import {
    ErrorCenterer,
    ErrorPanel,
    ErrorLargeText,
    ErrorSecondaryText,
    ErrorRetryText,
} from "./errorPageStyling";

interface ErrorProps {
    reset: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Error: React.FC<ErrorProps> = ({ reset }) => {
    const [ErrorMessage, SetErrorMessage] = useState("");

    const retry = (): void => {
        SetErrorMessage("Retrying...");
        setTimeout(() => {
            reset();
        }, 1000);
    };
    return (
        <ErrorCenterer>
            <ErrorPanel elevation={5}>
                <ErrorLargeText>OOPS!</ErrorLargeText>
                <ErrorSecondaryText>
                    We could not connect to the database at this time.
                </ErrorSecondaryText>
                <Button
                    variant="outlined"
                    onClick={() => {
                        retry();
                    }}
                >
                    Try again
                </Button>
                <ErrorRetryText>{ErrorMessage}</ErrorRetryText>
            </ErrorPanel>
        </ErrorCenterer>
    );
};

export default Error;
