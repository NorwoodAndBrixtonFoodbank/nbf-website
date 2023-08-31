"use client";

import React, { useState } from "react";
import Table from "@/components/Tables/Table";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";
import { deleteUser } from "@/app/admin/adminActions";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshPageButton from "@/app/admin/RefreshPageButton";
import { UserRow } from "@/app/admin/page";
import ManageUserModal from "@/app/admin/manageUser/ManageUserModal";
import DeleteUserDialog from "@/app/admin/deleteUser/DeleteUserDialog";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import SuccessFailureAlert, { AlertOptions } from "@/app/admin/common/SuccessFailureAlert";

const usersTableHeaderKeysAndLabels = [
    ["id", "User ID"],
    ["email", "Email"],
    ["userRole", "Role"],
    ["createdAt", "Created At"],
    ["updatedAt", "Updated At"],
] as const;

const formatTimestamp = (timestamp: number): string => {
    if (isNaN(timestamp)) {
        return "-";
    }

    return new Date(timestamp).toLocaleString("en-gb");
};

const userTableColumnDisplayFunctions = {
    createdAt: (createdAt: number) => {
        return formatTimestamp(createdAt);
    },
    updatedAt: (updatedAt: number) => {
        return formatTimestamp(updatedAt);
    },
};

interface Props {
    userData: UserRow[];
}

const UsersTable: React.FC<Props> = (props) => {
    const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
    const [userToEdit, setUserToEdit] = useState<UserRow | null>(null);

    const [tableAlertOptions, setTableAlertOptions] = useState<AlertOptions>({
        success: undefined,
        message: <></>,
    });

    const userOnDelete = (rowIndex: number): void => {
        setUserToDelete(props.userData[rowIndex]);
    };

    const userOnEdit = (rowIndex: number): void => {
        setUserToEdit(props.userData[rowIndex]);
    };

    return (
        <>
            <Table
                data={props.userData}
                headerKeysAndLabels={usersTableHeaderKeysAndLabels}
                onDelete={userOnDelete}
                filters={["email"]}
                onEdit={userOnEdit}
                headerFilters={["email"]}
                columnDisplayFunctions={userTableColumnDisplayFunctions}
                toggleableHeaders={["id", "email", "userRole", "createdAt", "updatedAt"]}
            />

            <DeleteUserDialog
                userToDelete={userToDelete}
                setUserToDelete={setUserToDelete}
                setAlertOptions={setTableAlertOptions}
            />
            <ManageUserModal
                userToEdit={userToEdit}
                setUserToEdit={setUserToEdit}
                setAlertOptions={setTableAlertOptions}
            />

            <OptionButtonsDiv>
                <SuccessFailureAlert
                    alertOptions={tableAlertOptions}
                    onClose={() => setTableAlertOptions({ success: undefined, message: <></> })}
                />
            </OptionButtonsDiv>
        </>
    );
};

export default UsersTable;
