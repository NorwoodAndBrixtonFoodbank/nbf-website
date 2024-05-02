import React from "react";
import styled from "styled-components";
import FreeFormTextInput from "../DataInput/FreeFormTextInput";
import { Filter, MethodConfig, defaultToString } from "./Filters";
import { TableHeaders } from "./Table";

interface TextFilterProps<Data,DBData extends Record<string,any>={}> {
    key: keyof Data;
    headers: TableHeaders<Data>;
    label: string;
    initialValue?: string;
    methodConfig: MethodConfig<Data, string,DBData>;
}

const TextFilterStyling = styled.div`
    & input[type="text"].MuiInputBase-input.MuiOutlinedInput-input {
        border: none;
    }
`;

export const buildTextFilter = <Data,DBData extends Record<string,any>={}>({
    key,
    label,
    initialValue = "",
    methodConfig,
}: TextFilterProps<Data,DBData>): Filter<Data, string, DBData> => {
    return {
        state: initialValue,
        initialState: initialValue,
        key: key,
        methodConfig: methodConfig,
        filterComponent: (state, setState) => {
            return (
                <TextFilterStyling key={label}>
                    <FreeFormTextInput
                        key={label}
                        value={state}
                        label={label}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setState(event.target.value);
                        }}
                    />
                </TextFilterStyling>
            );
        },
        areStatesIdentical: (stateA, stateB) => stateA === stateB,
    };
};

export const filterRowByText = <Data,>(row: Data, state: string, key: keyof Data): boolean => {
    let string = defaultToString(row[key]);
    string = string.toLowerCase();
    state = state.toLowerCase();
    return string.includes(state);
};
