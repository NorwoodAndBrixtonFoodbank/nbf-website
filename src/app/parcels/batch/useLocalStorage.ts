import React, { useEffect, useReducer, useRef } from "react";
import { BatchActionType, BatchTableDataState } from "@/app/parcels/batch/BatchTypes";

const LOCAL_STORAGE_KEY = "batchTableDataState";

export const getInitialTableState = (
    defaultInitialState: BatchTableDataState
): BatchTableDataState => {
    const storedTableState: string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
        return storedTableState ? JSON.parse(storedTableState) : defaultInitialState;
    } catch (error) {
        console.error("Error parsing local storage data", error);
        return defaultInitialState;
    }
};

export const writeLocalTableState = (tableState: BatchTableDataState): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableState));
};

export const useLocalStorage = (
    reducer: React.Reducer<BatchTableDataState, BatchActionType>,
    defaultState: BatchTableDataState
): [BatchTableDataState, React.Dispatch<BatchActionType>] => {
    const isDataGridInitialLoad = useRef<boolean>(true);
    const [tableState, dispatch] = useReducer(reducer, defaultState);

    useEffect(() => {
        if (isDataGridInitialLoad.current) {
            dispatch({
                type: "initialise_table_state",
                payload: { initialTableState: getInitialTableState(defaultState) },
            });
            isDataGridInitialLoad.current = false;
            return;
        }
    }, [defaultState]);

    useEffect(() => {
        writeLocalTableState(tableState);
    }, [tableState]);

    return [tableState, dispatch];
};
