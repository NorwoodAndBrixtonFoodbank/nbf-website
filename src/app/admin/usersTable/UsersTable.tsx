"use client";

import React, { useState } from "react";
import Table, { ColumnDisplayFunction, Row, TableHeaders } from "@/components/Tables/Table";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import { deleteUser } from "@/app/admin/adminActions";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshPageButton from "@/app/admin/RefreshPageButton";
import { User } from "@supabase/gotrue-js";

const DangerDialog = styled(Modal)`
    & #deleteUserDialog {
        background-color: ${(props) => props.theme.error};
    }
`;

export const OptionButtonDiv = styled.div`
    display: flex;
    padding-top: 1rem;
    gap: 1rem;
    justify-content: center;
`;

const usersTableHeaderKeysAndLabels: TableHeaders = [
    ["id", "USER ID"],
    ["email", "EMAIL"],
    ["userRole", "ROLE"],
    ["created_at", "CREATED AT"],
    ["updated_at", "UPDATED AT"],
];

const formatDatetime = (datetime: string | null): string => {
    if (datetime === null || isNaN(Date.parse(datetime))) {
        return "-";
    }

    return new Date(datetime).toLocaleString("en-gb");
};

const userTableColumnDisplayFunctions: { [headerKey: string]: ColumnDisplayFunction } = {
    // TODO Fix
    userRole: (row: Row) => row.data.app_metadata.role,
    created_at: (row: Row) => formatDatetime(row.data.created_at),
    updated_at: (row: Row) => formatDatetime(row.data.updated_at),
};

interface Props {
    userData: User[];
}

const UsersTable: React.FC<Props> = (props) => {
    const [userToDelete, setUserToDelete] = useState();
    const [refreshRequired, setRefreshRequired] = useState(false);

    const userOnDelete = (rowIndex: number): void => {
        setUserToDelete(props.userData[rowIndex]); // TODO VFB-23 Change onDelete in table to return row
    };

    const onUserDeleteConfirmation = async (): Promise<void> => {
        await deleteUser(userToDelete.id);

        // TODO VFB-23 Handle error on request to deleteUser()

        setUserToDelete(undefined);
        setRefreshRequired(true);
    };

    const onUserDeleteCancellation = (): void => {
        setUserToDelete(undefined);
    };

    return (
        <>
            <Table
                data={props.userData}
                headerKeysAndLabels={usersTableHeaderKeysAndLabels}
                onDelete={userOnDelete}
                headerFilters={["email"]}
                columnDisplayFunctions={userTableColumnDisplayFunctions}
            />

            {refreshRequired ? (
                <OptionButtonDiv>
                    <RefreshPageButton />
                </OptionButtonDiv>
            ) : (
                <></>
            )}

            <DangerDialog
                header="DELETE USER"
                headerId="deleteUserDialog"
                isOpen={userToDelete !== undefined}
                onClose={onUserDeleteCancellation}
            >
                Are you sure you want to delete user <b>{userToDelete ? userToDelete.email : ""}</b>
                ?
                <br />
                <OptionButtonDiv>
                    <Button
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={onUserDeleteConfirmation}
                    >
                        CONFIRM
                    </Button>
                    <Button color="secondary" onClick={onUserDeleteCancellation}>
                        CANCEL
                    </Button>
                </OptionButtonDiv>
            </DangerDialog>
        </>
    );
};

export default UsersTable;
