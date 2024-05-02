"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Table from "@/components/Tables/Table";
import ManageUserModal from "@/app/admin/manageUser/ManageUserModal";
import DeleteUserDialog from "@/app/admin/deleteUser/DeleteUserDialog";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import SuccessFailureAlert, { AlertOptions } from "@/app/admin/common/SuccessFailureAlert";
import { PaginationType } from "@/components/Tables/Filters";
import supabase from "@/supabaseClient";
import { getUsersDataAndCount } from "@/app/admin/usersTable/getUsersData";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import { usersFilters } from "@/app/admin/usersTable/filters";
import { getCurrentUser } from "@/server/getCurrentUser";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { defaultNumberOfUsersPerPage, numberOfUsersPerPageOptions } from "./constants";
import { usersTableHeaderKeysAndLabels, userTableColumnDisplayFunctions } from "./headers";
import { UserRow, UsersFilter, UsersSortState } from "./types";
import { usersSortableColumns } from "./sortableColumns";

const UsersTable: React.FC = () => {
    const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
    const [userToEdit, setUserToEdit] = useState<UserRow | null>(null);
    const [primaryFilters, setPrimaryFilters] = useState<UsersFilter<any>[]>(usersFilters);
    const [users, setUsers] = useState<UserRow[]>([]);
    const [filteredUsersCount, setFilteredUsersCount] = useState<number>(0);
    const [sortState, setSortState] = useState<UsersSortState>({ sortEnabled: false });
    const [isLoading, setIsLoading] = useState(true);
    const [userCountPerPage, setUserCountPerPage] = useState(defaultNumberOfUsersPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const startIndex = (currentPage - 1) * userCountPerPage;
    const endIndex = currentPage * userCountPerPage - 1;

    const usersTableFetchAbortController = useRef<AbortController | null>(null);

    const [tableAlertOptions, setTableAlertOptions] = useState<AlertOptions>({
        success: undefined,
        message: <></>,
    });

    const userOnDelete = (rowIndex: number): void => {
        setUserToDelete(users[rowIndex]);
    };

    const userOnEdit = (rowIndex: number): void => {
        setUserToEdit(users[rowIndex]);
    };

    const fetchAndDisplayUserData = useCallback(async () => {
        setIsLoading(true);
        if (usersTableFetchAbortController.current) {
            usersTableFetchAbortController.current.abort("stale request");
        }

        usersTableFetchAbortController.current = new AbortController();

        if (usersTableFetchAbortController.current) {
            setErrorMessage(null);

            const { data, error } = await getUsersDataAndCount(
                supabase,
                startIndex,
                endIndex,
                primaryFilters,
                sortState,
                usersTableFetchAbortController.current.signal
            );

            if (error) {
                switch (error.type) {
                    case "abortedFetchingProfilesTable":
                    case "abortedFetchingProfilesTableCount":
                        return;
                    case "failedToFetchProfilesTable":
                        setErrorMessage(`Failed to retrieve user profiles. Log ID: 
                    ${error.logId}`);
                        break;
                    case "failedToFetchProfilesTableCount":
                        setErrorMessage(`Failed to retrieve number of user profiles. Log ID: 
                    ${error.logId}`);
                        break;
                }
            } else {
                setUsers(data.userData);
                setFilteredUsersCount(data.count);
            }

            const { data: currentUser, error: currentUserError } = await getCurrentUser();
            if (currentUserError) {
                setErrorMessage(
                    `Error occured when fetching current user: ${currentUserError.type}, Log ID: ${currentUserError.logId}`
                );
            } else {
                setCurrentUserId(currentUser.id);
            }
        }
        usersTableFetchAbortController.current = null;
        setIsLoading(false);
    }, [startIndex, endIndex, primaryFilters, sortState]);

    useEffect(() => {
        void fetchAndDisplayUserData();
    }, [fetchAndDisplayUserData]);

    useEffect(() => {
        const subscriptionChannel = supabase
            .channel("users-table-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "profiles" },
                fetchAndDisplayUserData
            )
            .subscribe((status, err) => {
                subscriptionStatusRequiresErrorMessage(status, err, "website_data") &&
                    setErrorMessage("Error fetching users data, please reload");
            });

        return () => {
            supabase.removeChannel(subscriptionChannel);
        };
    }, [fetchAndDisplayUserData]);

    return (
        <>
            {errorMessage && <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>}
            <Table
                dataPortion={users}
                headerKeysAndLabels={usersTableHeaderKeysAndLabels}
                columnDisplayFunctions={userTableColumnDisplayFunctions}
                toggleableHeaders={["userId", "createdAt", "updatedAt"]}
                defaultShownHeaders={[
                    "firstName",
                    "lastName",
                    "userRole",
                    "email",
                    "telephoneNumber",
                    "createdAt",
                    "updatedAt",
                ]}
                checkboxConfig={{ displayed: false }}
                paginationConfig={{
                    enablePagination: true,
                    filteredCount: filteredUsersCount,
                    onPageChange: setCurrentPage,
                    onPerPageChange: setUserCountPerPage,
                    defaultRowsPerPage: defaultNumberOfUsersPerPage,
                    rowsPerPageOptions: numberOfUsersPerPageOptions,
                }}
                sortConfig={{
                    sortPossible: true,
                    sortableColumns: usersSortableColumns,
                    setSortState: setSortState,
                }}
                editableConfig={{
                    editable: true,
                    onDelete: userOnDelete,
                    onEdit: userOnEdit,
                    setDataPortion: setUsers,
                    isDeletable: (row: UserRow) => row.userId !== currentUserId,
                }}
                filterConfig={{
                    paginationType: PaginationType.Server,
                    primaryFiltersShown: true,
                    primaryFilters: primaryFilters,
                    setPrimaryFilters: setPrimaryFilters,
                    additionalFiltersShown: false,
                }}
                isLoading={isLoading}
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
