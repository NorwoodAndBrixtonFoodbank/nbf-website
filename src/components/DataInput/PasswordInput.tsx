"use client";

import React, { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Props {
    label?: string;
    defaultValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
}

const PasswordInput: React.FC<Props> = (props) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = (): void => {
        setShowPassword((isShown) => !isShown);
    };

    return (
        <TextField
            error={props.error}
            helperText={props.helperText}
            label={props.label}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            type={showPassword ? "text" : "password"}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};
export default PasswordInput;
