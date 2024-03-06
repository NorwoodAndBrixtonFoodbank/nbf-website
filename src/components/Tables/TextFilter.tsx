import React from "react";
import styled from "styled-components";
import FreeFormTextInput from "../DataInput/FreeFormTextInput";
import { KeyedFilter, defaultToString, headerLabelFromKey, keyedFilter } from "./Filters";
import { Supabase } from "@/supabaseUtils";
import { TableHeaders } from "./Table";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";

interface TextFilterProps<Data, Key> {
    key: Key;
    //getFilteredData: (supabase: Supabase, limit: number, state: string) => Promise<Data[]>;
    headers: TableHeaders<Data>;
    label?: string;
    caseSensitive?: boolean;
    initialValue?: string;
    filterMethod: (query: PostgrestFilterBuilder<Database["public"], any, any>, state: string) => PostgrestFilterBuilder<Database["public"], any, any>
}

const TextFilterStyling = styled.div`
    & input[type="text"].MuiInputBase-input.MuiOutlinedInput-input {
        border: none;
    }
`;

export const textFilter = <Data, Key extends keyof Data>({
    key,
    label,
    //getFilteredData,
    headers,
    caseSensitive = false,
    initialValue = "",
    filterMethod
}: TextFilterProps<Data, Key>): KeyedFilter<Data, Key, string> => {
    return keyedFilter(key, label ?? headerLabelFromKey(headers, key), {
        state: initialValue,
        initialState: initialValue,
        //getFilteredData: getFilteredData,
        filterMethod: filterMethod,
        shouldFilter: (data, state) => {
            let string = defaultToString(data[key]);

            if (!caseSensitive) {
                string = string.toLowerCase();
                state = state.toLowerCase();
            }

            return !string.includes(state);
        },
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
    });
};
