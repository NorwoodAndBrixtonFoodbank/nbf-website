"use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";
import { ButtonWrap } from "@/components/Buttons/GeneralButtonParts";
import { StyledDialog } from "@/components/Modal/Modal";

interface Props {
    children?: React.ReactNode;
    displayText: string;
}

const PopUpButton: React.FC<Props> = ({ children, displayText }) => {
    const [open, setOpen] = useState(false);

    return (
        <ButtonWrap>
            <Button variant="contained" onClick={() => setOpen(true)}>
                {displayText}
            </Button>
            <StyledDialog open={open} onClose={() => setOpen(false)}>
                {children}
            </StyledDialog>
        </ButtonWrap>
    );
};

export default PopUpButton;
