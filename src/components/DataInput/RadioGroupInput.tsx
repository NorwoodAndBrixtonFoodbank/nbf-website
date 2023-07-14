"use client";

import React from "react";

import RadioGroup from "@mui/material/RadioGroup";
import { FormControl, FormControlLabel, FormLabel, Radio } from "@mui/material";

interface Props {
    labelsAndValues: [string, string][];
    groupTitle?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroupInput: React.FC<Props> = (props) => {
    return (
        <FormControl>
            <FormLabel>{props.groupTitle}</FormLabel>
            <RadioGroup onChange={props.onChange}>
                {props.labelsAndValues.map(([label, value], index) => {
                    return (
                        <FormControlLabel
                            key={index}
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
