"use client";

import React from "react";
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material";

interface Props {
    optionLabels: string[];
    optionKeys: string[];
    groupLabel?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // eslint-disable-line no-unused-vars
}

const CheckboxInput: React.FC<Props> = (props) => {
    return (
        <FormControl>
            <FormLabel>{props.groupLabel}</FormLabel>
            <FormGroup>
                {props.optionLabels.map((label, index) => {
                    return (
                        <FormControlLabel
                            key={index}
                            label={label}
                            control={
                                <Checkbox
                                    name={props.optionKeys[index]}
                                    onChange={props.onChange}
                                />
                            }
                        />
                    );
                })}
            </FormGroup>
        </FormControl>
    );
};

export default CheckboxInput;
