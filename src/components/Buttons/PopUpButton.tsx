"use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";
import { StyledDialog } from "@/components/Modal/Modal";

interface Props {
    children?: React.ReactNode;
    displayText: string;
}

const PopUpButton: React.FC<Props> = ({ children, displayText }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button color="primary" variant="contained" onClick={() => setOpen(true)}>
                {displayText}
            </Button>
            <StyledDialog open={open} onClose={() => setOpen(false)}>
                {children}
            </StyledDialog>
        </>
    );
};

export default PopUpButton;
