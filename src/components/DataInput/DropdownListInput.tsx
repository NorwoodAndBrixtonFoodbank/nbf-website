"use client";

import React from "react";
import { MenuItem, InputLabel, Select, FormControl, SelectChangeEvent } from "@mui/material";

interface Props {
    labelsAndValues: [string, string][];
    listTitle?: string;
    defaultValue?: string;
    onChange: (event: SelectChangeEvent<unknown>) => void;
}

const DropdownListInput: React.FC<Props> = (props) => {
    return (
        <FormControl fullWidth>
            <InputLabel>{props.listTitle}</InputLabel>
            <Select
                defaultValue={props.defaultValue ?? ""}
                label={props.listTitle}
                onChange={props.onChange}
            >
                {props.labelsAndValues.map(([label, value], index) => {
                    return (
                        <MenuItem key={index} value={value}>
                            {label}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

export default DropdownListInput;
