"use client";

import React, { useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshPageButton from "@/app/admin/RefreshPageButton";
import { Schema } from "@/database_utils";
import supabase from "@/supabaseClient";

const DangerDialog = styled(Modal)`
    & #deleteCollectionCentreDialog {
        background-color: ${(props) => props.theme.error};
    }
`;

export const OptionButtonDiv = styled.div`
    display: flex;
    padding-top: 1rem;
    gap: 1rem;
    justify-content: center;
`;

const collectionCentresTableHeaderKeysAndLabels: TableHeaders = [
    ["primary_key", "Centre ID"],
    ["name", "Name"],
    ["acronym", "Acronym"],
];

interface Props {
    collectionCentreData: Schema["collection_centres"][];
}

const CollectionCentresTables: React.FC<Props> = (props) => {
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

        // TODO display error message in table
        if (error) {
            throw new Error(
                "We could not delete the collection centre at this time. Please try again later."
            );
        }

        setCollectionCentreToDelete(undefined);
        setRefreshRequired(true);
    };

    const onCollectionCentreDeleteCancellation = (): void => {
        setCollectionCentreToDelete(undefined);
    };

    return (
        <>
            <Table
                data={props.collectionCentreData}
                headerKeysAndLabels={collectionCentresTableHeaderKeysAndLabels}
                onDelete={collectionCentreOnDelete}
                headerFilters={["name"]}
            />

            {refreshRequired && (
                <OptionButtonDiv>
                    <RefreshPageButton />
                </OptionButtonDiv>
            )}

            <DangerDialog
                header="DELETE COLLECTION CENTRE"
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
                        CONFIRM
                    </Button>
                    <Button color="secondary" onClick={onCollectionCentreDeleteCancellation}>
                        CANCEL
                    </Button>
                </OptionButtonDiv>
            </DangerDialog>
        </>
    );
};

export default CollectionCentresTables;
