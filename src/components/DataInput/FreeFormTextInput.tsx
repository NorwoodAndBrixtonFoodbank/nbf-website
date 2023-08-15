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
}

const FreeFormTextInput: React.FC<Props> = (props) => {
    return (
        <TextField
            error={props.error}
            helperText={props.helperText}
            label={props.label}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            value={props.value}
            multiline={props.multiline}
            maxRows={props.maxRows}
            minRows={props.minRows}
        />
    );
};
export default FreeFormTextInput;
