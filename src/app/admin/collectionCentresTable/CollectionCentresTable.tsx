"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Schema } from "@/databaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import {
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModes,
    GridRowModesModel,
} from "@mui/x-data-grid";
import { AuditLog, sendAuditLog } from "@/server/auditLog";
import Header from "@/app/admin/websiteDataTable/Header";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import StyledDataGrid from "@/app/admin/common/StyledDataGrid";
import { LinearProgress } from "@mui/material";
import {
    fetchCollectionCentres,
    insertNewCollectionCentre,
    updateDbCollectionCentre,
} from "@/app/admin/collectionCentresTable/CollectionCentreActions";
import { EditToolbar } from "@/app/admin/collectionCentresTable/CollectionCentresTableToolbar";

export interface CollectionCentresTableRow {
    acronym: Schema["collection_centres"]["acronym"];
    name: Schema["collection_centres"]["name"];
    id: Schema["collection_centres"]["primary_key"];
    isShown: Schema["collection_centres"]["is_shown"];
    isNew: boolean;
}

function getBaseAuditLogForCollectionCentreAction(
    action: string,
    collectionCentreRow: CollectionCentresTableRow,
    options?: {
        excludeCollectionCentreId?: boolean;
    }
): Pick<AuditLog, "action" | "content" | "collectionCentreId"> {
    return {
        action,
        content: {
            collectionCentreName: collectionCentreRow.name,
            collectionCentreAcronym: collectionCentreRow.acronym,
            collectionCentreIsShown: collectionCentreRow.isShown,
        },
        collectionCentreId: options?.excludeCollectionCentreId ? undefined : collectionCentreRow.id,
    };
}

const CollectionCentresTable: React.FC = () => {
    const [rows, setRows] = useState<CollectionCentresTableRow[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const getCollectionCentresForTable = useCallback(async () => {
        setErrorMessage(null);
        const { data, error } = await fetchCollectionCentres();
        if (error) {
            setErrorMessage("Error fetching data, please reload");
            return;
        }
        setRows(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        void getCollectionCentresForTable();
    }, [getCollectionCentresForTable]);

    useEffect(() => {
        const subscriptionChannel = supabase
            .channel("collection-centre-table-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "collection_centres" },
                getCollectionCentresForTable
            )
            .subscribe((status, error) => {
                if (subscriptionStatusRequiresErrorMessage(status, error, "collection_centres")) {
                    setErrorMessage("Error fetching data, please reload");
                }
            });

        return () => {
            void supabase.removeChannel(subscriptionChannel);
        };
    }, [getCollectionCentresForTable]);

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel((currentValue) => ({
            ...currentValue,
            [id]: { mode: GridRowModes.View },
        }));
    };

    const processRowUpdate = async (
        newRow: CollectionCentresTableRow
    ): Promise<CollectionCentresTableRow> => {
        setErrorMessage(null);
        setIsLoading(true);

        if (newRow.isNew) {
            const { data: createdCollectionCentre, error: insertCollectionCentreError } =
                await insertNewCollectionCentre(newRow);
            const baseAuditLog = getBaseAuditLogForCollectionCentreAction(
                "add a new collection centre",
                newRow,
                { excludeCollectionCentreId: true }
            );

            if (insertCollectionCentreError) {
                setErrorMessage(
                    `Failed to add the collection centre. Log ID: ${insertCollectionCentreError.logId}`
                );
                void sendAuditLog({
                    ...baseAuditLog,
                    wasSuccess: false,
                    logId: insertCollectionCentreError.logId,
                });
            } else {
                void sendAuditLog({
                    ...baseAuditLog,
                    collectionCentreId: createdCollectionCentre.collectionCentreId,
                    wasSuccess: true,
                });
                setIsLoading(false);
            }
        } else {
            const { error: updateCollectionCentreError } = await updateDbCollectionCentre(newRow);
            const baseAuditLog = getBaseAuditLogForCollectionCentreAction(
                "update a collection centre",
                newRow
            );

            if (updateCollectionCentreError) {
                setErrorMessage(
                    `Failed to update the collection centre. Log ID: ${updateCollectionCentreError.logId}`
                );
                void sendAuditLog({
                    ...baseAuditLog,
                    wasSuccess: false,
                    logId: updateCollectionCentreError.logId,
                });
            } else {
                void sendAuditLog({ ...baseAuditLog, wasSuccess: true });
                setIsLoading(false);
            }
        }

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
            void logErrorReturnLogId(
                "Edited row in collection centre admin table is undefined onCancelClick"
            );
            setErrorMessage("Table error, please try again");
        } else if (editedRow.isNew) {
            setRows((currentValue) => currentValue.filter((row) => row.id !== id));
        }
    };

    const collectionCentreColumns: GridColDef[] = [
        {
            field: "name",
            headerName: "Collection Centre Name",
            flex: 1,
            minWidth: 400,
            editable: true,
            renderHeader: (params) => <Header {...params} />,
        },
        {
            field: "acronym",
            headerName: "Acronym",
            flex: 1,
            editable: true,
            renderHeader: (params) => <Header {...params} />,
        },
        {
            field: "isShown",
            type: "boolean",
            headerName: "Show",
            flex: 1,
            editable: true,
            renderHeader: (params) => <Header {...params} />,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            flex: 1,
            cellClassName: "actions",
            renderHeader: (params) => <Header {...params} />,
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
            {errorMessage && <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>}
            {rows && (
                <StyledDataGrid
                    rows={rows}
                    columns={collectionCentreColumns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={setRowModesModel}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: EditToolbar,
                        loadingOverlay: LinearProgress,
                    }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel, rows },
                    }}
                    loading={isLoading}
                    getRowClassName={(params) =>
                        (params.indexRelativeToCurrentPage + 1) % 2 === 0
                            ? "datagrid-row-even"
                            : "datagrid-row-odd"
                    }
                    hideFooter
                />
            )}
        </>
    );
};

export default CollectionCentresTable;
