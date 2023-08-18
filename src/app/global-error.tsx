"use client";
import React from "react";
import { ErrorCenterer, ErrorPanel, ErrorLargeText, ErrorSecondaryText } from "./errorPageStyling";
import LinkButton from "@/components/Buttons/LinkButton";

interface ErrorProps {
    Error: Error;
    reset: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Error: React.FC<ErrorProps> = ({ Error, reset }) => {
    return (
        <ErrorCenterer>
            <ErrorPanel>
                <ErrorLargeText>OOPS!</ErrorLargeText>
                <ErrorSecondaryText>
                    There has been an error. Please try again or contact a developer if the problem
                    persists.
                </ErrorSecondaryText>
                <LinkButton link="/clients" page="Return to Home" />
            </ErrorPanel>
        </ErrorCenterer>
    );
};

export default Error;
