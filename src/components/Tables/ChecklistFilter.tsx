"use client";

import React from "react";
import CheckboxGroupPopup from "../DataInput/CheckboxGroupPopup";
import { Filter, MethodConfig } from "./Filters";

interface ChecklistFilterProps<Data, DbData extends Record<string, any> = {}> {
    key: keyof Data;
    filterLabel: string;
    itemLabelsAndKeys: [string, string][];
    initialCheckedKeys: string[];
    methodConfig: MethodConfig<Data, string[], DbData>;
}

export const checklistFilter = <Data, DbData extends Record<string, any> = {}>({
    key,
    filterLabel,
    itemLabelsAndKeys,
    initialCheckedKeys,
    methodConfig,
}: ChecklistFilterProps<Data>): Filter<Data, string[], DbData> => {
    return {
        key: key,
        state: initialCheckedKeys,
        initialState: initialCheckedKeys,
        methodConfig,
        areStatesIdentical: (stateA, stateB) =>
            stateA.length === stateB.length && stateA.every((optionA) => stateB.includes(optionA)),
        filterComponent: function (
            state: string[],
            setState: (state: string[]) => void
        ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
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
