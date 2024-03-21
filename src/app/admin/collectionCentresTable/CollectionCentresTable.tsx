"use client";

import React, { useEffect, useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshPageButton from "@/app/admin/common/RefreshPageButton";
import { Schema } from "@/databaseUtils";
import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { buildTextFilter, filterRowByText } from "@/components/Tables/TextFilter";

interface CollectionCentresTableRow {
    acronym: Schema["collection_centres"]["acronym"];
    name: Schema["collection_centres"]["name"];
    primary_key: Schema["collection_centres"]["primary_key"];
}

const DangerDialog = styled(Modal)`
    & .header {
        background-color: ${(props) => props.theme.error};
        text-transform: uppercase;
    }

    button {
        text-transform: uppercase;
    }
`;

export const OptionButtonDiv = styled.div`
    display: flex;
    padding-top: 1rem;
    gap: 1rem;
    justify-content: center;
`;

const collectionCentresTableHeaderKeysAndLabels: TableHeaders<Schema["collection_centres"]> = [
    ["primary_key", "Centre ID"],
    ["name", "Name"],
    ["acronym", "Acronym"],
];

interface Props {
    collectionCentreData: CollectionCentresTableRow[];
}

const CollectionCentresTables: React.FC<Props> = (props) => {
    const [collectionCentres, setCollectionCentres] = useState<Schema["collection_centres"][]>(
        props.collectionCentreData
    );
    const [collectionCentreToDelete, setCollectionCentreToDelete] =
        useState<Schema["collection_centres"]>();
    const [refreshRequired, setRefreshRequired] = useState(false);

    const collectionCentreOnDelete = (rowIndex: number): void => {
        setCollectionCentreToDelete(props.collectionCentreData[rowIndex]); // TODO VFB-25 Change onDelete in table to return row
    };

    const onCollectionCentreDeleteConfirmation = async (): Promise<void> => {
        const { error } = await supabase
            .from("collection_centres")
            .delete()
            .eq("name", collectionCentreToDelete!.name);

        if (error) {
            throw new DatabaseError("delete", "collection centre data");
        }

        setCollectionCentreToDelete(undefined);
        setRefreshRequired(true);
    };

    const onCollectionCentreDeleteCancellation = (): void => {
        setCollectionCentreToDelete(undefined);
    };

    const filters: Filter<CollectionCentresTableRow, string>[] = [
        buildTextFilter({
            key: "name",
            label: "Name",
            headers: collectionCentresTableHeaderKeysAndLabels,
            methodConfig: { paginationType: PaginationType.Client, method: filterRowByText },
        }),
        buildTextFilter({
            key: "acronym",
            label: "Acronym",
            headers: collectionCentresTableHeaderKeysAndLabels,
            methodConfig: { paginationType: PaginationType.Client, method: filterRowByText },
        }),
    ];
    const [primaryFilters, setPrimaryFilters] =
        useState<Filter<CollectionCentresTableRow, string>[]>(filters);

    useEffect(() => {
        setCollectionCentres(
            props.collectionCentreData.filter((row) => {
                return primaryFilters.every((filter) => {
                    return (
                        filter.methodConfig.paginationType === PaginationType.Client &&
                        filter.methodConfig.method(row, filter.state, filter.key)
                    );
                });
            })
        );
    }, [primaryFilters, props.collectionCentreData]);

    return (
        <>
            <Table
                dataPortion={collectionCentres}
                headerKeysAndLabels={collectionCentresTableHeaderKeysAndLabels}
                defaultShownHeaders={["name", "acronym"]}
                toggleableHeaders={["primary_key"]}
                paginationConfig={{ enablePagination: false }}
                checkboxConfig={{ displayed: false }}
                sortConfig={{ sortPossible: false }}
                editableConfig={{
                    editable: true,
                    onDelete: collectionCentreOnDelete,
                    setDataPortion: setCollectionCentres,
                }}
                filterConfig={{
                    primaryFiltersShown: true,
                    primaryFilters: primaryFilters,
                    setPrimaryFilters: setPrimaryFilters,
                    additionalFiltersShown: false,
                }}
            />

            {refreshRequired && (
                <OptionButtonDiv>
                    <RefreshPageButton />
                </OptionButtonDiv>
            )}

            <DangerDialog
                header="Delete Collection Centre"
                headerId="deleteCollectionCentreDialog"
                isOpen={collectionCentreToDelete !== undefined}
                onClose={onCollectionCentreDeleteCancellation}
            >
                Are you sure you want to delete collection centre
                <b>{collectionCentreToDelete ? ` ${collectionCentreToDelete.name}` : ""}</b>?
                <OptionButtonDiv>
                    <Button
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={onCollectionCentreDeleteConfirmation}
                    >
                        Confirm
                    </Button>
                    <Button color="secondary" onClick={onCollectionCentreDeleteCancellation}>
                        Cancel
                    </Button>
                </OptionButtonDiv>
            </DangerDialog>
        </>
    );
};

export default CollectionCentresTables;
