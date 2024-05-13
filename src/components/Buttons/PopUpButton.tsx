"use client";

import React, { useState } from "react";
import Button, { ButtonPropsColorOverrides } from "@mui/material/Button";
import { ButtonWrap } from "@/components/Buttons/GeneralButtonParts";
import { StyledDialog } from "@/components/Modal/Modal";
import { OverridableStringUnion } from "@mui/types";

interface Props {
    children?: React.ReactNode;
    displayText: string;
    colour?: OverridableStringUnion<
        "primary" | "inherit" | "secondary" | "success" | "error" | "info" | "warning",
        ButtonPropsColorOverrides
    >;
}

const PopUpButton: React.FC<Props> = ({ children, displayText, colour = "primary" }) => {
    const [open, setOpen] = useState(false);

    return (
        <ButtonWrap>
            <Button color={colour} variant="contained" onClick={() => setOpen(true)}>
                {displayText}
            </Button>
            <StyledDialog open={open} onClose={() => setOpen(false)}>
                {children}
            </StyledDialog>
        </ButtonWrap>
    );
};

export default PopUpButton;
