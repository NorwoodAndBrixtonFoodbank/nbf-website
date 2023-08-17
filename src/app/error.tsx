"use client";
import React from "react";
import Button from "@mui/material/Button";

interface ErrorProps {
    Error: Error;
    reset: () => void;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Error: React.FC<ErrorProps> = ({ Error, reset }) => {
    return (
        <div>
            <h1>Something Went Wrong</h1>
            <Button onClick={reset}>Try again</Button>
        </div>
    );
};

export default Error;
