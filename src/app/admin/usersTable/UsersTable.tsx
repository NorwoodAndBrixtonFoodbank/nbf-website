"use client";

import React, { useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";

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
    const userOnDelete = () => {
        setUserToDelete((value) => 1);
    };

    const onUserDeleteConfirmation = () => {
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
                CONFIRM BUTTON HERE
            </DangerDialog>
        </>
    );
};

export default UsersTable;
