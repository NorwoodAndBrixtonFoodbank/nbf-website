"use client";

import React from "react";
import { TextField } from "@mui/material";

interface Props {
    label?: string;
    defaultValue?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // eslint-disable-line no-unused-vars
}

const FreeFormTextInput: React.FC<Props> = (props) => {
    return (
        <TextField
            label={props.label}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
        />
    );
};

export default FreeFormTextInput;
