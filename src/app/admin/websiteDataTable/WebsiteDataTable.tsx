"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModes,
    GridRowModesModel,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { LinearProgress } from "@mui/material";
import { logError, logInfo } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";
import { fetchWebsiteData, updateDbWebsiteData } from "./FetchWebsiteData";

export interface WebsiteDataRow {
    name: string;
    id: string;
    value: string;
}

const WebsiteDataTable: React.FC = () => {
    const [rows, setRows] = useState<WebsiteDataRow[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchWebsiteData()
            .then((response) => setRows(response))
            .catch((error) => {
                void logError("Error fetching website data", error);
                throw new DatabaseError("fetch", "website data");
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        // This requires that the DB table has Realtime turned on
        const subscriptionChannel = supabase
            .channel("packing-slot-table-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "packing_slots" },
                async () => {
                    try {
                        const websiteData = await fetchWebsiteData();
                        setRows(websiteData);
                    } catch (error) {
                        if (error) {
                            void logError("Error with fetch: Packing slots subscription", error);
                            setRows([]);
                        }
                    }
                }
            )
            .subscribe((status, err) => {
                if (status === "TIMED_OUT") {
                    void logError("Channel Timed Out: Subscribe to packing_slot table", err);
                } else if (status === "CHANNEL_ERROR") {
                    void logError("Channel Error: Subscribe to packing_slot table", err);
                } else if (status === "CLOSED") {
                    void logInfo("Subscription to packing_slot table closed");
                } else {
                    void logInfo("Subscribed to packing_slot table");
                }
            });

        return () => {
            void supabase.removeChannel(subscriptionChannel);
        };
    }, []);

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel((currentValue) => ({
            ...currentValue,
            [id]: { mode: GridRowModes.View },
        }));
    };

    const processRowUpdate = (newRow: WebsiteDataRow): WebsiteDataRow => {
        setIsLoading(true);
        updateDbWebsiteData(newRow)
            .catch((error) => void logError("Update error with website data", error))
            .finally(() => setIsLoading(false));
        return newRow;
    };

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            //prevents default behaviour of saving the edited state when clicking away from row being edited, force user to use save or cancel buttons
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel((currentValue) => ({
            ...currentValue,
            [id]: { mode: GridRowModes.Edit },
        }));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel((currentValue) => ({
            ...currentValue,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        }));

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow === undefined) {
            void logError("Edited row in packing slots admin table is undefined onCancelClick");
        }
    };

    const websiteDataColumns: GridColDef[] = [
        { field: "name", headerName: "Field", flex: 1, editable: false },
        { field: "value", headerName: "Value", flex: 3, editable: true },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            flex: 1,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                            key="Save"
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                            key="Cancel"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                        key="Edit"
                    />,
                ];
            },
        },
    ];

    return (
        <>
            {rows && (
                <DataGrid
                    rows={rows}
                    columns={websiteDataColumns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={setRowModesModel}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        loadingOverlay: LinearProgress,
                    }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel, rows },
                    }}
                    loading={isLoading}
                    getRowHeight={() => 'auto'}
                />
            )}
        </>
    );
};

export default WebsiteDataTable;
