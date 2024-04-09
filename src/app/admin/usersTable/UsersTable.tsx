"use client";

import React, { useEffect, useRef, useState } from "react";
import Table, { SortOptions, SortState, TableHeaders } from "@/components/Tables/Table";
import { UserRow } from "@/app/admin/page";
import ManageUserModal from "@/app/admin/manageUser/ManageUserModal";
import DeleteUserDialog from "@/app/admin/deleteUser/DeleteUserDialog";
import OptionButtonsDiv from "@/app/admin/common/OptionButtonsDiv";
import SuccessFailureAlert, { AlertOptions } from "@/app/admin/common/SuccessFailureAlert";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { buildTextFilter } from "@/components/Tables/TextFilter";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";
import { checklistFilter } from "@/components/Tables/ChecklistFilter";
import { getUsersDataAndCount } from "@/app/admin/usersTable/getUsersData";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import {
    emailSearch,
    firstNameSearch,
    lastNameSearch,
} from "@/app/admin/usersTable/usersTableFilters";

interface userRoleOptionsSet {
    key: string;
    value: string;
}
interface Props {
    userData: UserRow[];
}

const usersTableHeaderKeysAndLabels: TableHeaders<UserRow> = [
    ["id", "User ID"],
    ["firstName", "First Name"],
    ["lastName", "Last Name"],
    ["userRole", "Role"],
    ["email", "Email"],
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
    createdAt: (createdAt: number) => {
        return formatTimestamp(createdAt);
    },
    updatedAt: (updatedAt: number) => {
        return formatTimestamp(updatedAt);
    },
};

export const buildUserRoleFilter = async (): Promise<Filter<UserRow, string[]>> => {
    const userRoleSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        return query.in("role", state);
    };

    const keySet = new Set();

    const { data, error } = await supabase.from("profiles").select("role");

    if (error) {
        const logId = await logErrorReturnLogId(
            "Error with fetch: User role filter options",
            error
        );
        throw new DatabaseError("fetch", "user role filter options", logId);
    }

    const optionsResponse = data ?? [];

    const optionsSet = optionsResponse.reduce<userRoleOptionsSet[]>((filteredOptions, row) => {
        if (!row.role || keySet.has(row.role)) {
            return filteredOptions;
        }

        keySet.add(row.role);
        filteredOptions.push({ key: row.role, value: row.role });

        return filteredOptions;
    }, []);

    optionsSet.sort();

    return checklistFilter<UserRow>({
        key: "userRole",
        filterLabel: "User Role",
        itemLabelsAndKeys: optionsSet.map((option) => [option.value, option.key]),
        initialCheckedKeys: optionsSet.map((option) => option.key),
        methodConfig: { paginationType: PaginationType.Server, method: userRoleSearch },
    });
};

const defaultNumberOfParcelsPerPage = 10;
const numberOfParcelsPerPageOptions = [10, 25, 50, 100];

const UsersTable: React.FC<Props> = (props) => {
    const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
    const [userToEdit, setUserToEdit] = useState<UserRow | null>(null);
    const [primaryFilters, setPrimaryFilters] = useState<Filter<UserRow, any>[]>([]);
    const [usersDataPortion, setUsersDataPortion] = useState<UserRow[]>([]);
    const [filteredUsersCount, setFilteredUsersCount] = useState<number>(0);
    const [sortState, setSortState] = useState<SortState<UserRow>>({ sortEnabled: false });
    const [isLoading, setIsLoading] = useState(true);
    const [userCountPerPage, setUserCountPerPage] = useState(defaultNumberOfParcelsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const startPoint = (currentPage - 1) * userCountPerPage;
    const endPoint = currentPage * userCountPerPage - 1;

    const usersTableFetchAbortController = useRef<AbortController | null>(null);

    const [tableAlertOptions, setTableAlertOptions] = useState<AlertOptions>({
        success: undefined,
        message: <></>,
    });

    useEffect(() => {
        const buildFilters = async (): Promise<{
            primaryFilters: Filter<UserRow, any>[];
        }> => {
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
                await buildUserRoleFilter(),
            ];
            return { primaryFilters: filters };
        };
        (async () => {
            const filters = await buildFilters();
            setPrimaryFilters(filters.primaryFilters);
        })();
    }, []);

    const userOnDelete = (rowIndex: number): void => {
        setUserToDelete(props.userData[rowIndex]);
    };

    const userOnEdit = (rowIndex: number): void => {
        setUserToEdit(props.userData[rowIndex]);
    };

    useEffect(() => {
        setIsLoading(true);
        if (usersTableFetchAbortController.current) {
            usersTableFetchAbortController.current.abort("stale request");
        }
        usersTableFetchAbortController.current = new AbortController();
        if (usersTableFetchAbortController.current) {
            setErrorMessage(null);
            setIsLoading(true);

            getUsersDataAndCount(
                supabase,
                startPoint,
                endPoint,
                primaryFilters,
                sortState,
                usersTableFetchAbortController.current.signal
            )
                .then(async ({ userData, count }) => {
                    setUsersDataPortion(userData);
                    setFilteredUsersCount(count);
                })
                .catch((error) => {
                    if (error instanceof DatabaseError) {
                        setErrorMessage(error.message);
                    }
                })
                .finally(() => {
                    usersTableFetchAbortController.current = null;
                    setIsLoading(false);
                });
        }
    }, [startPoint, endPoint, primaryFilters, sortState]);

    return (
        <>
            {errorMessage && <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>}
            <Table
                dataPortion={usersDataPortion}
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
                    defaultRowsPerPage: defaultNumberOfParcelsPerPage,
                    rowsPerPageOptions: numberOfParcelsPerPageOptions,
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
                    setDataPortion: setUsersDataPortion,
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
