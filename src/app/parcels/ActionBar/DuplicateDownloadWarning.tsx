"use client";

import React from "react";
import Alert from "@mui/material/Alert/Alert";
import styled from "styled-components";

export interface DuplicateDownloadWarningProps {
    postcodes: string[];
}

const StyledAlert = styled(Alert)`
    border-radius: 4px;
`;

const DuplicateDownloadWarning: React.FC<DuplicateDownloadWarningProps> = (props) => {
    return (
        <StyledAlert severity="warning">
            The following postcodes have already been downloaded: {props.postcodes.join(", ")}. Are
            you sure you want to print again?
        </StyledAlert>
    );
};

export default DuplicateDownloadWarning;
