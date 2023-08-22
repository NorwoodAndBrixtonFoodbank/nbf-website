import React from "react";
import styled from "styled-components";
import { TableHeaders } from "@/components/Tables/Table";

export interface Filter<Data, State> {
    shouldFilter: (data: Data, state: State) => boolean;
    filterComponent: (state: State, setState: (state: State) => void) => React.ReactElement;
    state: State;
    initialState: State;
    clear: (state: State, setState: (state: State) => void) => void;
}

export interface KeyedFilter<Data, Key extends keyof Data, State> extends Filter<Data, State> {
    key: Key;
    label: string;
}

const keyedFilter = <Data, Key extends keyof Data, State>(
    key: Key,
    label: string,
    filter: Filter<Data, State>
): KeyedFilter<Data, Key, State> => {
    return {
        key,
        label,
        ...filter,
    };
};

export const headerLabelFromKey = <Data, Key extends keyof Data>(
    headers: TableHeaders<Data>,
    key: Key
): string => {
    return headers.find(([headerKey]) => headerKey === key)![1];
};

const StyledFilterBar = styled.input`
    font-size: 14px;
    width: 15rem;
    overflow: visible;
    box-shadow: none;
    padding: 4px 12px 4px 12px;

    &:focus {
        outline: none;
    }
`;

interface TextFilterProps<Data, Key extends keyof Data> {
    key: Key;
    label: string;
    caseSensitive?: boolean;
    initialValue?: string;
}

const defaultToString = (value: any): string => {
    if (typeof value === "string") {
        return value;
    }

    return JSON.stringify(value);
};

export const textFilter = <Data, Key extends keyof Data>({
    key,
    label,
    caseSensitive = false,
    initialValue = "",
}: TextFilterProps<Data, Key>): KeyedFilter<Data, Key, string> => {
    return keyedFilter(key, label, {
        state: initialValue,
        initialState: initialValue,
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
                <StyledFilterBar
                    key={label}
                    type="text"
                    value={state}
                    placeholder={`Filter by ${label}`}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setState(event.target.value);
                    }}
                />
            );
        },
        clear: (_oldState, setState) => {
            setState(initialValue);
        },
    });
};
