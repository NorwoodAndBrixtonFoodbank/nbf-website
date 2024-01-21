import React from "react";
import { KeyedFilter, defaultToString, keyedFilter } from "./Filters";
import CheckboxGroupPopup from "../DataInput/CheckboxGroupPopup";

interface ChecklistFilterProps<Data, Key extends keyof Data> {
    key: Key;
    filterLabel: string;
    itemLabelsAndKeys: [string, string][];
    initialCheckedKeys: string[];
    cellMatchOverride?: (rowData: Data, selectedKeys: string[]) => boolean;
}

export const checklistFilter = <Data, Key extends keyof Data>({
    key,
    filterLabel,
    itemLabelsAndKeys,
    initialCheckedKeys,
    cellMatchOverride,
}: ChecklistFilterProps<Data, Key>): KeyedFilter<Data, Key, string[]> => {
    const cellMatchesCheckedItems = (rowData: Data, selectedKeys: string[]): boolean => {
        const cellData = defaultToString(rowData[key]);
        return selectedKeys.some((key) => cellData.includes(key));
    };

    return keyedFilter(key, filterLabel, {
        state: initialCheckedKeys,
        initialState: initialCheckedKeys,
        shouldFilter: (rowData, state) => {
            return cellMatchOverride
                ? !cellMatchOverride(rowData, state)
                : !cellMatchesCheckedItems(rowData, state);
        },
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
                    labelsAndKeys={itemLabelsAndKeys}
                    defaultCheckedKeys={state}
                    groupLabel={filterLabel}
                    onChange={onChangeCheckbox}
                />
            );
        },
    });
};
