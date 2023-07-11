"use client";

import React from "react";

import RadioGroup from "@mui/material/RadioGroup";
import { FormControl, FormControlLabel, FormLabel, Radio } from "@mui/material";

interface Props {
    optionLabels: string[];
    optionValues: string[];
    groupLabel?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // eslint-disable-line no-unused-vars
}

const RadioGroupInput: React.FC<Props> = (props) => {
    return (
        <FormControl>
            <FormLabel>{props.groupLabel}</FormLabel>
            <RadioGroup onChange={props.onChange}>
                {props.optionLabels.map((label, index) => {
                    return (
                        <FormControlLabel
                            key={index}
                            label={label}
                            value={props.optionValues[index]}
                            control={<Radio />}
                        />
                    );
                })}
            </RadioGroup>
        </FormControl>
    );
};

export default RadioGroupInput;
