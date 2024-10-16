"use client";

import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";

interface Props {
    onClick: () => void;
}

const SignOutButton: React.FC<Props> = (props: Props) => {
    return (
        <IconButton aria-label="Sign Out Button" onClick={props.onClick}>
            <LogoutIcon />
        </IconButton>
    );
};

export default SignOutButton;
