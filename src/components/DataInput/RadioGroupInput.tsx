"use client";

import React from "react";

import RadioGroup from "@mui/material/RadioGroup";
import { FormControl, FormControlLabel, FormLabel, Radio } from "@mui/material";

interface Props {
    labelsAndValues: [string, string][];
    groupTitle?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    defaultValue?: string;
    value?: string;
}

const RadioGroupInput: React.FC<Props> = (props) => {
    return (
        <FormControl>
            <FormLabel>{props.groupTitle}</FormLabel>
            <RadioGroup
                onChange={props.onChange}
                defaultValue={props.defaultValue}
                value={props.value}
            >
                {props.labelsAndValues.map(([label, value]) => {
                    return (
                        <FormControlLabel
                            key={value}
                            label={label}
                            value={value}
                            control={<Radio />}
                        />
                    );
                })}
            </RadioGroup>
        </FormControl>
    );
};

export default RadioGroupInput;
