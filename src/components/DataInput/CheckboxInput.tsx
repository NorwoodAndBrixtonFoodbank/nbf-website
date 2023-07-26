"use client";

import React from "react";
import { Checkbox, FormControl, FormControlLabel } from "@mui/material";

interface Props {
    label?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxInput: React.FC<Props> = (props) => {
    return (
        <FormControl>
            <FormControlLabel
                label={props.label}
                control={<Checkbox onChange={props.onChange} />}
            />
        </FormControl>
    );
};

export default CheckboxInput;

// TODO: Not needed code possibly
