"use client";

import React from "react";
import CheckboxGroupPopup from "../DataInput/CheckboxGroupPopup";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { Filter, MethodConfig } from "./Filters";

interface ChecklistFilterProps<Data> {
    key: keyof Data;
    filterLabel: string;
    itemLabelsAndKeys: [string, string][];
    initialCheckedKeys: string[];
    methodConfig: MethodConfig<Data, string[]>;
}

export const checklistFilter = <Data,>({
    key,
    filterLabel,
    itemLabelsAndKeys,
    initialCheckedKeys,
    methodConfig,
}: ChecklistFilterProps<Data>): Filter<Data, string[]> => {
    return {
        key: key,
        state: initialCheckedKeys,
        initialState: initialCheckedKeys,
        methodConfig,
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
