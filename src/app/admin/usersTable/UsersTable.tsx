"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Table, { SortOptions, SortState, TableHeaders } from "@/components/Tables/Table";
import { UserRow } from "@/app/admin/page";
import ManageUserModal from "@/app/admin/manageUser/ManageUserModal";
import DeleteUserDialog from "@/app/admin/deleteUser/DeleteUserDialog";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import SuccessFailureAlert, { AlertOptions } from "@/app/admin/common/SuccessFailureAlert";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { buildTextFilter } from "@/components/Tables/TextFilter";
import supabase from "@/supabaseClient";
import { getUsersDataAndCount } from "@/app/admin/usersTable/getUsersData";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import {
    buildUserRoleFilter,
    emailSearch,
    firstNameSearch,
    lastNameSearch,
} from "@/app/admin/usersTable/usersTableFilters";
import { getCurrentUser } from "@/server/getCurrentUser";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";

const usersTableHeaderKeysAndLabels: TableHeaders<UserRow> = [
    ["id", "User ID"],
    ["firstName", "First Name"],
    ["lastName", "Last Name"],
    ["email", "Email"],
    ["userRole", "Role"],
    ["telephoneNumber", "Telephone Number"],
    ["createdAt", "Created At"],
    ["updatedAt", "Updated At"],
];

const sortableColumns: SortOptions<UserRow>[] = [
    {
        key: "firstName",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("first_name", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "lastName",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("last_name", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "userRole",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("role", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "email",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("email", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "telephoneNumber",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("telephone_number", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "createdAt",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("created_at", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "updatedAt",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("updated_at", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
];

const formatTimestamp = (timestamp: number): string => {
    if (isNaN(timestamp)) {
        return "-";
    }

    return new Date(timestamp).toLocaleString("en-gb");
};

const userTableColumnDisplayFunctions = {
    createdAt: (createdAt: number | null) => {
        return createdAt === null ? "-" : formatTimestamp(createdAt);
    },
    updatedAt: (updatedAt: number | null) => {
        return updatedAt === null ? "-" : formatTimestamp(updatedAt);
    },
};

const defaultNumberOfUsersPerPage = 10;
const numberOfUsersPerPageOptions = [10, 25, 50, 100];

const UsersTable: React.FC = () => {
    const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
    const [userToEdit, setUserToEdit] = useState<UserRow | null>(null);
    const [primaryFilters, setPrimaryFilters] = useState<Filter<UserRow, any>[]>([]);
    const [users, setUsers] = useState<UserRow[]>([]);
    const [filteredUsersCount, setFilteredUsersCount] = useState<number>(0);
    const [sortState, setSortState] = useState<SortState<UserRow>>({ sortEnabled: false });
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

    const buildFilters = async (): Promise<Filter<UserRow, any>[]> => {
        const filters: Filter<UserRow, any>[] = [
            buildTextFilter({
                key: "firstName",
                label: "First Name",
                headers: usersTableHeaderKeysAndLabels,
                methodConfig: {
                    paginationType: PaginationType.Server,
                    method: firstNameSearch,
                },
            }),
            buildTextFilter({
                key: "lastName",
                label: "Last Name",
                headers: usersTableHeaderKeysAndLabels,
                methodConfig: {
                    paginationType: PaginationType.Server,
                    method: lastNameSearch,
                },
            }),
            buildTextFilter({
                key: "email",
                label: "Email",
                headers: usersTableHeaderKeysAndLabels,
                methodConfig: {
                    paginationType: PaginationType.Server,
                    method: emailSearch,
                },
            }),
        ];

        const { data: userRoleFilter, error } = await buildUserRoleFilter();
        if (error) {
            switch (error.type) {
                case "failedToFetchUserRoleFilterOptions":
                    setErrorMessage(`Failed to retrieve user role filters. Log ID: ${error.logId}`);
                    break;
            }
        } else {
            filters.push(userRoleFilter);
        }
        return filters;
    };

    useEffect(() => {
        (async () => {
            const filters = await buildFilters();
            setPrimaryFilters(filters);
        })();
    }, []);

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
                toggleableHeaders={["id", "createdAt", "updatedAt"]}
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
                    sortableColumns: sortableColumns,
                    setSortState: setSortState,
                }}
                editableConfig={{
                    editable: true,
                    onDelete: userOnDelete,
                    onEdit: userOnEdit,
                    setDataPortion: setUsers,
                    isDeletable: (row: UserRow) => row.id !== currentUserId,
                }}
                filterConfig={{
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
