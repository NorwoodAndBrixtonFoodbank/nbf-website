"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Tables/Table";
import { UserRow } from "@/app/admin/page";
import ManageUserModal from "@/app/admin/manageUser/ManageUserModal";
import DeleteUserDialog from "@/app/admin/deleteUser/DeleteUserDialog";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import SuccessFailureAlert, { AlertOptions } from "@/app/admin/common/SuccessFailureAlert";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { buildTextFilter, filterRowByText } from "@/components/Tables/TextFilter";

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

const filters: Filter<UserRow, string>[] = [
    buildTextFilter({
        key: "email",
        label: "Email",
        headers: usersTableHeaderKeysAndLabels,
        methodConfig: { paginationType: PaginationType.Client, method: filterRowByText },
    }),
    buildTextFilter({
        key: "userRole",
        label: "Role",
        headers: usersTableHeaderKeysAndLabels,
        methodConfig: { paginationType: PaginationType.Client, method: filterRowByText },
    }),
];

interface Props {
    userData: UserRow[];
}

const UsersTable: React.FC<Props> = (props) => {
    const [users, setUsers] = useState<UserRow[]>(props.userData);
    const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
    const [userToEdit, setUserToEdit] = useState<UserRow | null>(null);
    const [primaryFilters, setPrimaryFilters] = useState<Filter<UserRow, string>[]>(filters);

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

    useEffect(() => {
        setUsers(
            props.userData.filter((row) => {
                return primaryFilters.every((filter) => {
                    return (
                        filter.methodConfig.paginationType === PaginationType.Client &&
                        filter.methodConfig.method(row, filter.state, filter.key)
                    );
                });
            })
        );
    }, [primaryFilters, props.userData]);

    return (
        <>
            <Table
                dataPortion={users}
                headerKeysAndLabels={usersTableHeaderKeysAndLabels}
                columnDisplayFunctions={userTableColumnDisplayFunctions}
                toggleableHeaders={["id", "createdAt", "updatedAt"]}
                defaultShownHeaders={["email", "userRole", "createdAt", "updatedAt"]}
                checkboxConfig={{ displayed: false }}
                paginationConfig={{ enablePagination: false }}
                sortConfig={{ sortPossible: false }}
                editableConfig={{
                    editable: true,
                    onDelete: userOnDelete,
                    onEdit: userOnEdit,
                    setDataPortion: setUsers,
                }}
                filterConfig={{
                    primaryFiltersShown: true,
                    primaryFilters: primaryFilters,
                    setPrimaryFilters: setPrimaryFilters,
                    additionalFiltersShown: false,
                }}
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
