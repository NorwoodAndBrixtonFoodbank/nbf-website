import React from "react";
import styled from "styled-components";
import { TableHeaders } from "@/components/Tables/Table";
import { DatePicker } from "@mui/x-date-pickers";
import FreeFormTextInput from "../DataInput/FreeFormTextInput";

export interface Filter<Data, State> {
    shouldFilter: (data: Data, state: State) => boolean;
    filterComponent: (state: State, setState: (state: State) => void) => React.ReactElement;
    state: State;
    initialState: State;
}

export interface KeyedFilter<Data, Key extends keyof Data, State> extends Filter<Data, State> {
    key: Key;
    label: string;
}

export const isKeyedFilter = <Data, Key extends keyof Data, State>(
    filter: Filter<Data, State>
): filter is KeyedFilter<Data, Key, State> => {
    return "key" in filter;
};

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
    return headers.find(([headerKey]) => headerKey === key)?.[1] ?? key.toString();
};

const TextFilterStyling = styled.div`
    & input[type="text"].MuiInputBase-input.MuiOutlinedInput-input {
        border: none;
    }
`;

interface TextFilterProps<Data, Key extends keyof Data> {
    key: Key;
    label: string;
    caseSensitive?: boolean;
    initialValue?: string;
}

const defaultToString = (value: unknown): string => {
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
                <TextFilterStyling>
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

const DateFilterContainer = styled.div`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    & input[type="text"].MuiInputBase-input.MuiOutlinedInput-input {
        border: none;
    }

    & .MuiFormControl-root,
    & .MuiInputBase-root {
        width: 12rem;
    }
`;

interface DateFilterState {
    from: Date | null;
    to: Date | null;
}

interface DateFilterProps<Data, Key extends keyof Data> {
    key: Key;
    label: string;
    initialValue?: DateFilterState;
}

export const dateFilter = <Data, Key extends keyof Data>({
    key,
    label,
    initialValue = {
        from: null,
        to: null,
    },
}: DateFilterProps<Data, Key>): KeyedFilter<Data, Key, DateFilterState> => {
    return keyedFilter(key, label, {
        state: initialValue,
        initialState: initialValue,
        shouldFilter: (data, state) => {
            const date = data[key];
            const from = state.from;
            const to = state.to;

            if (from !== null && date < from) {
                return true;
            }

            if (to !== null && date > to) {
                return true;
            }

            return false;
        },
        filterComponent: (state, setState) => {
            return (
                <DateFilterContainer>
                    <DatePicker
                        onChange={(value) =>
                            setState({
                                ...state,
                                from: value,
                            })
                        }
                        maxDate={state.to}
                        value={state.from}
                        label="From"
                    />
                    <DatePicker
                        onAccept={(value) =>
                            setState({
                                ...state,
                                to: value,
                            })
                        }
                        minDate={state.from}
                        value={state.to}
                        label="To"
                    />
                </DateFilterContainer>
            );
        },
    });
};
