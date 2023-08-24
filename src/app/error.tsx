"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import {
    ErrorCenterer,
    ErrorPanel,
    ErrorLargeText,
    ErrorSecondaryText,
    ErrorRetryText,
} from "@/app/errorStylingandMessages";
import { FetchError } from "@/app/errorClasses";

interface ErrorProps {
    error: Error;
    reset: () => void;
}

const ErrorPage: React.FC<ErrorProps> = ({ error, reset }) => {
    let message;
    if (error instanceof FetchError) {
        message = "Validation Error";
    } else {
        message = error.message;
    }
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
                <ErrorSecondaryText>{message}</ErrorSecondaryText>
                <Button variant="outlined" onClick={retry}>
                    Try again
                </Button>
                <ErrorRetryText>{ErrorMessage}</ErrorRetryText>
            </ErrorPanel>
        </ErrorCenterer>
    );
};

export default ErrorPage;
