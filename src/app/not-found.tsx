"use client";
import React from "react";
import {
    ErrorCenterer,
    ErrorPanel,
    ErrorLargeText,
    ErrorSecondaryText,
} from "@/app/errorStylingandMessages";
import LinkButton from "@/components/Buttons/LinkButton";

const NotFoundPage: React.FC = () => {
    return (
        <ErrorCenterer>
            <ErrorPanel elevation={5}>
                <ErrorLargeText>OOPS!</ErrorLargeText>
                <ErrorSecondaryText>404 Error || This page does not exist</ErrorSecondaryText>
                <LinkButton link="/">Return to Home</LinkButton>
            </ErrorPanel>
        </ErrorCenterer>
    );
};

export default NotFoundPage;
