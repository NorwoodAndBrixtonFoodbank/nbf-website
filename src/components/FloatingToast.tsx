import React from "react";
import styled from "styled-components";
import {
    Alert,
    AlertColor,
    AlertPropsColorOverrides,
    AlertPropsVariantOverrides,
} from "@mui/material";
import { OverridableStringUnion } from "@mui/types";

interface Props {
    message?: string;
    severity?: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;
    variant?: OverridableStringUnion<
        "standard" | "filled" | "outlined",
        AlertPropsVariantOverrides
    >;
}

const FloatingToastVerticalContainer = styled.div`
    position: relative;
`;

const FloatingToastContainer = styled.div`
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 100;
`;

const FloatingToast: React.FC<Props> = ({ message, severity, variant }) => {
    return (
        <FloatingToastVerticalContainer>
            <FloatingToastContainer>
                <Alert severity={severity} variant={variant}>
                    {message}
                </Alert>
            </FloatingToastContainer>
        </FloatingToastVerticalContainer>
    );
};

export default FloatingToast;
