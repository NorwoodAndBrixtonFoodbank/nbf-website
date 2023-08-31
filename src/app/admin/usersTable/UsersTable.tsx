"use client";

import React, { useState } from "react";
import Table, { Row, TableColumnDisplayFunctions, TableHeaders } from "@/components/Tables/Table";
import { UserRow } from "@/app/admin/page";
import ManageUserModal from "@/app/admin/manageUser/ManageUserModal";
import DeleteUserDialog from "@/app/admin/deleteUser/DeleteUserDialog";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import SuccessFailureAlert, { AlertOptions } from "@/app/admin/common/SuccessFailureAlert";

const usersTableHeaderKeysAndLabels: TableHeaders = [
    ["id", "User ID"],
    ["email", "Email"],
    ["userRole", "Role"],
    ["createdAt", "Created At"],
    ["updatedAt", "Updated At"],
];

const formatTimestamp = (timestamp: number): string => {
    if (isNaN(timestamp)) {
        return "-";
    }

    return new Date(timestamp).toLocaleString("en-gb");
};

const userTableColumnDisplayFunctions: TableColumnDisplayFunctions = {
    createdAt: (row: Row) => {
        const rowData = row.data as UserRow;
        return formatTimestamp(rowData.createdAt);
    },
    updatedAt: (row: Row) => {
        const rowData = row.data as UserRow;
        return formatTimestamp(rowData.updatedAt);
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
