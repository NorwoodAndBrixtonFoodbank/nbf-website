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
    useGridApiRef,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { LinearProgress } from "@mui/material";
import { DatabaseError } from "@/app/errorClasses";
import { fetchWebsiteData, updateDbWebsiteData } from "./FetchWebsiteData";
import CustomComponent from "./CustomEditComponent";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";

export interface WebsiteDataRow {
    readableName: string;
    id: string;
    value: string;
}

const WebsiteDataTable: React.FC = () => {
    const [rows, setRows] = useState<WebsiteDataRow[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const apiRef = useGridApiRef();

    useEffect(() => {
        fetchWebsiteData()
            .then((response) => setRows(response))
            .catch(async (error) => {
                const logId = await logErrorReturnLogId("Error with fetch: website data", error);
                throw new DatabaseError("fetch", "website data table", logId);
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        // This requires that the DB table has Realtime turned on
        const subscriptionChannel = supabase
            .channel("website-data-table-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "website_data" },
                async () => {
                    try {
                        const websiteData = await fetchWebsiteData();
                        setRows(websiteData);
                    } catch (error) {
                        if (error) {
                            const logId = await logErrorReturnLogId(
                                "Error with fetch: website data subscription",
                                error
                            );
                            setRows([]);
                            throw new DatabaseError("fetch", "website data table", logId);
                        }
                    }
                }
            )
            .subscribe(async (status, err) => {
                if (status === "TIMED_OUT") {
                    const logId = await logErrorReturnLogId(
                        "Channel Timed Out: Subscribe to website_data table",
                        err
                    );
                    throw new DatabaseError("fetch", "website data table", logId);
                } else if (status === "CHANNEL_ERROR") {
                    const logId = await logErrorReturnLogId(
                        "Channel Error: Subscribe to website_data table",
                        err
                    );
                    throw new DatabaseError("fetch", "website data table", logId);
                } else if (status === "CLOSED") {
                    logInfoReturnLogId("Subscription to website_data table closed");
                } else {
                    logInfoReturnLogId("Subscribed to website_data table");
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
            .catch(async (error) => {
                const logId = await logErrorReturnLogId("Error with update: website data", error);
                throw new DatabaseError("update", "website data table", logId);
            })
            .finally(() => setIsLoading(false));
        return newRow;
    };

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
        if (
            params.reason === GridRowEditStopReasons.rowFocusOut ||
            params.reason === GridRowEditStopReasons.enterKeyDown
        ) {
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

    const handleCancelClick = (id: GridRowId) => async () => {
        console.log(rowModesModel[id]);
        setRowModesModel((currentValue) => ({
            ...currentValue,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        }));

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow === undefined) {
            {
                const logId = await logErrorReturnLogId(
                    "Edited row in website data admin table is undefined onCancelClick"
                );
                throw new DatabaseError("update", "website data table", logId);
            }
        }
    };

    const websiteDataColumns: GridColDef[] = [
        { field: "readableName", headerName: "Field", flex: 1, editable: false },
        {
            field: "value",
            headerName: "Value",
            flex: 3,
            editable: true,
            renderCell: (params) => <CustomComponent {...params} editMode={false} />,
            renderEditCell: (params) => (
                <CustomComponent {...params} hasFocus={true} editMode={true} />
            ),
        },
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
                    getRowHeight={() => 150}
                    apiRef={apiRef}
                />
            )}
        </>
    );
};

export default WebsiteDataTable;
