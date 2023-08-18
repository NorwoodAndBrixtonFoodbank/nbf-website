"use client";
import React from "react";
import { ErrorCenterer, ErrorPanel, ErrorLargeText, ErrorSecondaryText } from "./errorPageStyling";
import LinkButton from "@/components/Buttons/LinkButton";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Error: React.FC<{}> = () => {
    return (
        <ErrorCenterer>
            <ErrorPanel elevation={5}>
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
