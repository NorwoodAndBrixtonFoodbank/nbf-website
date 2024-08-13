"use client";

import React, { useEffect } from "react";
import { MenuItem, InputLabel, Select, FormControl, SelectChangeEvent } from "@mui/material";

interface Props<Value> {
    labelsAndValues: [string, string][];
    listTitle?: string;
    defaultValue?: Value;
    onChange?: (event: SelectChangeEvent<Value>) => void;
    selectLabelId: string;
    focusOnDropdown?: boolean;
}

const DropdownListInput = <Value,>(props: Props<Value>): React.ReactElement => {
    const elementToFocusRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        props.focusOnDropdown && elementToFocusRef.current?.focus();
    }, [props.focusOnDropdown]);

    return (
        <FormControl fullWidth>
            <InputLabel id={props.selectLabelId}>{props.listTitle}</InputLabel>
            <Select
                defaultValue={props.defaultValue ?? undefined}
                onChange={props.onChange}
                labelId={props.selectLabelId}
                inputRef={elementToFocusRef}
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
