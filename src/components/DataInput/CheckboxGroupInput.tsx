"use client";

import React from "react";
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material";

interface Props {
    defaultCheckedKeys?: string[];
    labelsAndKeys: [string, string][];
    groupLabel?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxGroupInput: React.FC<Props> = (props) => {
    return (
        <FormControl>
            {props.groupLabel && <FormLabel>{props.groupLabel}</FormLabel>}
            <FormGroup>
                {props.labelsAndKeys.map(([label, key]) => {
                    return (
                        <FormControlLabel
                            key={key}
                            label={label}
                            control={
                                <Checkbox
                                    name={key}
                                    onChange={props.onChange}
                                    defaultChecked={props.defaultCheckedKeys?.includes(key)}
                                />
                            }
                        />
                    );
                })}
            </FormGroup>
        </FormControl>
    );
};

export default CheckboxGroupInput;
