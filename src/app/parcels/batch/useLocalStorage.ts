import React, { useEffect, useReducer, useRef } from "react";
import { BatchActionType, BatchTableDataState } from "@/app/parcels/batch/BatchTypes";

const LOCAL_STORAGE_KEY = "batchTableDataState";

export const getInitialTableState = (
    defaultInitialState: BatchTableDataState
): BatchTableDataState => {
    const storedTableState: string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedTableState ? JSON.parse(storedTableState) : defaultInitialState;
};

export const setLocalTableState = (tableState: BatchTableDataState): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableState));
};

export const useLocalStorage = (
    reducer: React.Reducer<BatchTableDataState, BatchActionType>,
    defaultState: BatchTableDataState
): [BatchTableDataState, React.Dispatch<BatchActionType>] => {
    const dataGridInitialLoad = useRef<boolean>(true);
    const [tableState, dispatch] = useReducer(reducer, defaultState);

    useEffect(() => {
        if (dataGridInitialLoad.current) {
            dispatch({
                type: "initialise_table_state",
                payload: { initialTableState: getInitialTableState(defaultState) },
            });
            dataGridInitialLoad.current = false;
            return;
        }
    }, [defaultState]);

    useEffect(() => {
        setLocalTableState(tableState);
    }, [tableState]);

    return [tableState, dispatch];
};
