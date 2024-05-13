"use client";

import React from "react";
import { MenuItem, InputLabel, Select, FormControl, SelectChangeEvent } from "@mui/material";

interface Props<Value> {
    labelsAndValues: [string, string][];
    listTitle?: string;
    defaultValue?: Value;
    onChange?: (event: SelectChangeEvent<Value>) => void;
    selectLabelId: string;
}

const DropdownListInput = <Value,>(props: Props<Value>): React.ReactElement => {
    return (
        <FormControl fullWidth>
            <InputLabel id={props.selectLabelId}>{props.listTitle}</InputLabel>
            <Select
                defaultValue={props.defaultValue ?? undefined}
                onChange={props.onChange}
                labelId={props.selectLabelId}
            >
                {props.labelsAndValues.map(([label, value]) => {
                    return (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

export default DropdownListInput;
