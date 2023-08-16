"use client";

import React from "react";
import { TextField } from "@mui/material";
interface Props {
    label?: string;
    defaultValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
    value?: string;
    multiline?: boolean;
    maxRows?: number;
    minRows?: number;
    className?: string;
}

const FreeFormTextInput: React.FC<Props> = (props) => {
    return (
        <TextField
            className={props.className}
            error={props.error}
            helperText={props.helperText}
            label={props.label}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            value={props.value}
        />
    );
};
export default FreeFormTextInput;
