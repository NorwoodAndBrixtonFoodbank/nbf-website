"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Tables/Table";
import { UserRow } from "@/app/admin/page";
import ManageUserModal from "@/app/admin/manageUser/ManageUserModal";
import DeleteUserDialog from "@/app/admin/deleteUser/DeleteUserDialog";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import SuccessFailureAlert, { AlertOptions } from "@/app/admin/common/SuccessFailureAlert";
import { Filter } from "@/components/Tables/Filters";
import { buildTextFilter, filterDataByText } from "@/components/Tables/TextFilter";

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
    const [userDataPortion, setUserDataPortion] = useState<UserRow[]>(props.userData);
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


    const filters: Filter<UserRow, string>[] = [buildTextFilter({key: "email", label: "Email", headers: usersTableHeaderKeysAndLabels, methodConfig: {methodType: "data", method: filterDataByText}}) , buildTextFilter({key: "userRole", label: "Role", headers: usersTableHeaderKeysAndLabels, methodConfig: {methodType: "data", method: filterDataByText}})]
    const [primaryFilters, setPrimaryFilters] = useState<Filter<UserRow, string>[]>(filters);
    
    useEffect(()=> {
        let filteredData = props.userData;
        primaryFilters.forEach((filter) => {if (filter.methodConfig.methodType === "data") {filteredData = filter.methodConfig.method(filteredData, filter.state, filter.key)}});
        setUserDataPortion(filteredData);
    }, [...primaryFilters])


    return (
        <>
            <Table
                dataPortion={userDataPortion}
                headerKeysAndLabels={usersTableHeaderKeysAndLabels}
                columnDisplayFunctions={userTableColumnDisplayFunctions}
                toggleableHeaders={["id", "createdAt", "updatedAt"]}
                defaultShownHeaders={["email", "userRole", "createdAt", "updatedAt"]}
                checkboxConfig={{ displayed: false }}
                paginationConfig={{pagination: false}}
                sortConfig={{sortShown: false}}
                editableConfig={{editable: true, onDelete: userOnDelete, onEdit: userOnEdit, setDataPortion: setUserDataPortion}}
                filterConfig={{primaryFiltersShown: true, primaryFilters: primaryFilters, setPrimaryFilters: setPrimaryFilters, additionalFiltersShown: false}}
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
