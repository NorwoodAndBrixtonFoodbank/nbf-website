"use client";
import React from "react";
import { TextField } from "@mui/material";
interface Props {
    label?: string;
    defaultValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
}
// TODO: Make changes a new ticket
const FreeFormTextInput: React.FC<Props> = (props) => {
    return (
        <TextField
            error={props.error}
            helperText={props.helperText}
            label={props.label}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
        />
    );
};
export default FreeFormTextInput;
