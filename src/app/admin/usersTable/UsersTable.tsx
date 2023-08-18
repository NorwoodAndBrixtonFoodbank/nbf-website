"use client";

import React, { useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import { deleteUser } from "@/app/admin/adminActions";
import Button from "@mui/material/Button";

const DangerDialog = styled(Modal)`
    & #deleteUserDialog {
        background-color: ${(props) => props.theme.error};
    }
`;

const usersTableHeaderKeysAndLabels: TableHeaders = [
    ["id", "USER ID"],
    ["email", "EMAIL"],
    ["role", "ROLE"],
    ["created_at", "CREATED AT"],
    ["updated_at", "UPDATED AT"],
];

interface Props {
    userData: any; // TODO MAKE TYPE
}

const UsersTable: React.FC<Props> = (props) => {
    // TODO REMOVE DEFAULT
    const [userToEdit, setUserToEdit] = useState();
    const [userToDelete, setUserToDelete] = useState();

    const userOnEdit = () => {};
    const userOnDelete = (rowIndex: number) => {
        setUserToDelete(props.userData[rowIndex]); // TODO ADD TYPE AND CHANGE onDelete to return row instead of index
        console.log(userToDelete);
    };

    const onUserDeleteConfirmation = async () => {
        const response = await deleteUser(userToDelete.id);

        console.log(response);

        // TODO INSERT CONFIRMATION MODAL

        setUserToDelete(undefined);
    };

    const onUserDeleteCancellation = () => {
        setUserToDelete(undefined);
    };

    return (
        <>
            <Table
                data={props.userData}
                headerKeysAndLabels={usersTableHeaderKeysAndLabels}
                onEdit={userOnEdit}
                onDelete={userOnDelete}
                headerFilters={["email"]}
            />

            {/*<ConfirmDialog*/}
            {/*    isOpen={userToDelete !== undefined}*/}
            {/*    message="Are you sure that you want to delete user: _EMAIL_? This action is IRREVERSIBLE."*/}
            {/*    onConfirm={onUserDeleteConfirmation}*/}
            {/*    onCancel={onUserDeleteCancellation}*/}
            {/*/>*/}

            <DangerDialog
                header="DELETE USER"
                headerId="deleteUserDialog"
                isOpen={userToDelete !== undefined}
                onClose={onUserDeleteCancellation}
            >
                {`Are you sure you want to delete user ${userToDelete ? userToDelete.email : ""}?`}
                {/*CONFIRM BUTTON HERE*/}
                <Button onClick={onUserDeleteConfirmation}>CONFIRM</Button>
            </DangerDialog>
        </>
    );
};

export default UsersTable;
