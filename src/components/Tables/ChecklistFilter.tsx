"use client";

import React from "react";
import CheckboxGroupPopup from "../DataInput/CheckboxGroupPopup";
import { ServerSideFilter, ServerSideFilterMethod } from "./Filters";

interface ChecklistFilterProps<
    Data,
    DbData extends Record<string, unknown> = Record<string, never>,
> {
    key: keyof Data;
    filterLabel: string;
    itemLabelsAndKeys: [string, string][];
    initialCheckedKeys: string[];
    method: ServerSideFilterMethod<DbData, string[]>;
    persistOnClear?: boolean;
}

export const serverSideChecklistFilter = <
    Data,
    DbData extends Record<string, unknown> = Record<string, never>,
>({
    key,
    filterLabel,
    itemLabelsAndKeys,
    initialCheckedKeys,
    method,
    persistOnClear = false,
}: ChecklistFilterProps<Data, DbData>): ServerSideFilter<Data, string[], DbData> => {
    return {
        key: key,
        state: initialCheckedKeys,
        initialState: initialCheckedKeys,
        method,
        persistOnClear: persistOnClear,
        areStatesIdentical: (stateA, stateB) =>
            stateA.length === stateB.length && stateA.every((optionA) => stateB.includes(optionA)),
        filterComponent: function (
            state: string[],
            setState: (state: string[]) => void
        ): React.ReactNode {
            const onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
                const checkboxKey = event.target.name as string;
                if (event.target.checked) {
                    setState([...state, checkboxKey]);
                } else {
                    setState(state.filter((shownKey) => shownKey !== checkboxKey));
                }
            };

            return (
                <CheckboxGroupPopup
                    key={filterLabel}
                    labelsAndKeys={itemLabelsAndKeys}
                    defaultCheckedKeys={state}
                    groupLabel={filterLabel}
                    onChange={onChangeCheckbox}
                />
            );
        },
    };
};
