"use client";

import React, { ReactNode } from "react";
import { MenuItem, InputLabel, Select, FormControl, SelectChangeEvent } from "@mui/material";

interface Props {
    optionLabels: string[];
    optionValues: string[];
    listLabel?: string;
    defaultValue?: string;
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void; // eslint-disable-line no-unused-vars
}

const DropdownListInput: React.FC<Props> = (props) => {
    return (
        <FormControl fullWidth>
            <InputLabel>{props.listLabel}</InputLabel>
            <Select
                defaultValue={props.defaultValue ?? ""}
                label={props.listLabel}
                onChange={props.onChange}
            >
                {props.optionLabels.map((label, index) => {
                    return (
                        <MenuItem key={index} value={props.optionValues[index]}>
                            {label}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

export default DropdownListInput;
