import React from "react";
import styled from "styled-components";
import FreeFormTextInput from "../DataInput/FreeFormTextInput";
import { KeyedFilter, headerLabelFromKey, keyedFilter } from "./Filters";
import { TableHeaders } from "./Table";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";

interface TextFilterProps<Data, Key> {
    key: Key;
    headers: TableHeaders<Data>;
    label: string;
    initialValue?: string;
    filterMethod: (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string
    ) => PostgrestFilterBuilder<Database["public"], any, any>;
}

const TextFilterStyling = styled.div`
    & input[type="text"].MuiInputBase-input.MuiOutlinedInput-input {
        border: none;
    }
`;

export const textFilter = <Data, Key extends keyof Data>({
    key,
    label,
    headers,
    initialValue = "",
    filterMethod,
}: TextFilterProps<Data, Key>): KeyedFilter<Data, Key, string> => {
    return keyedFilter(key, label ?? headerLabelFromKey(headers, key), {
        state: initialValue,
        initialState: initialValue,
        //getFilteredData: getFilteredData,
        filterMethod: filterMethod,
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
