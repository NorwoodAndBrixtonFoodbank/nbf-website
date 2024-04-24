"use client";

import React, { useCallback, useEffect, useState } from "react";
import Table, { SortOptions, SortState, TableHeaders } from "@/components/Tables/Table";
import supabase from "@/supabaseClient";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import { Json } from "@/databaseTypesFile";
import { formatDateTime, formatBoolean, formatJson } from "@/common/format";
import {
    AuditLogCountError,
    AuditLogError,
    fetchAuditLog,
    fetchAuditLogCount,
} from "./fetchAuditLogData";
import { PaginationType } from "@/components/Tables/Filters";

export interface AuditLogRow {
    action: string;
    clientId: string;
    collectionCentreId: string;
    content: Json;
    createdAt: string;
    eventId: string;
    listHotelId: string;
    listId: string;
    logId: string;
    packingSlotId: string;
    parcelId: string;
    profileId: string;
    statusOrder: string;
    userId: string;
    wasSuccess: boolean;
    websiteData: string;
}

const auditLogTableHeaderKeysAndLabels: TableHeaders<AuditLogRow> = [
    ["action", "Action"],
    ["createdAt", "Time"],
    ["userId", "User ID"],
    ["content", "Content"],
    ["wasSuccess", "Success"],
    ["logId", "Log ID"],
    ["parcelId", "Parcel ID"],
    ["clientId", "Client ID"],
    ["eventId", "Event ID"],
    ["listId", "List ID"],
    ["collectionCentreId", "Collection Centre ID"],
    ["profileId", "Profile ID"],
    ["packingSlotId", "Packing Slot ID"],
    ["listHotelId", "List Hotel ID"],
    ["statusOrder", "Status Order"],
    ["websiteData", "Website Data"],
];

const auditLogTableColumnDisplayFunctions = {
    createdAt: formatDateTime,
    wasSuccess: formatBoolean,
    content: formatJson,
};

const sortableColumns: SortOptions<AuditLogRow>[] = [
    {
        key: "action",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("action", { ascending: sortDirection === "asc" }),
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
        key: "userId",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("user_id", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "content",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("content", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "wasSuccess",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("wasSuccess", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "logId",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("log_id", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "parcelId",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("parcel_id", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "clientId",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("client_id", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "eventId",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("event_id", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "listId",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("list_id", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "collectionCentreId",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("collection_centre_id", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "profileId",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("profile_id", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "packingSlotId",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("packing_slot_id", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "listHotelId",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("list_hotel_id", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "statusOrder",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("status_order", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "websiteData",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("website_data", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
];

const getErrorMessage = (error: AuditLogError | AuditLogCountError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedAuditLogFetch":
            errorMessage = "Failed to fetch audit log.";
            break;
        case "failedAuditLogCountFetch":
            errorMessage = "Failed to fetch audit log count.";
            break;
        case "nullCount":
            errorMessage = "Audit log table empty.";
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const defaultNumberOfAuditLogRowsPerPage = 10;
const numberOfAuditLogRowsPerPageOption = [10, 25, 50, 100];

const AuditLogTable: React.FC = () => {
    const [auditLogDataPortion, setAuditLogDataPortion] = useState<AuditLogRow[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [auditLogCount, setAuditLogCount] = useState<number>(0);
    const [sortState, setSortState] = useState<SortState<AuditLogRow>>({ sortEnabled: false });
    const [auditLogCountPerPage, setAuditLogCountPerPage] = useState(
        defaultNumberOfAuditLogRowsPerPage
    );
    const [currentPage, setCurrentPage] = useState(1);
    const startPoint = (currentPage - 1) * auditLogCountPerPage;
    const endPoint = currentPage * auditLogCountPerPage - 1;

    const fetchAndDisplayAuditLog = useCallback(async () => {
        setErrorMessage(null);

        const { count, error: countError } = await fetchAuditLogCount(supabase);
        if (countError) {
            setErrorMessage(getErrorMessage(countError));
            return;
        }
        setAuditLogCount(count);

        const { data, error } = await fetchAuditLog(supabase, startPoint, endPoint, sortState);
        if (error) {
            setErrorMessage(getErrorMessage(error));
            return;
        }
        setAuditLogDataPortion(data);
    }, [startPoint, endPoint, sortState]);

    useEffect(() => {
        void fetchAndDisplayAuditLog();
    }, [fetchAndDisplayAuditLog]);

    useEffect(() => {
        const subscriptionChannel = supabase
            .channel("audit-logs-table-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "audit_log" },
                fetchAndDisplayAuditLog
            )
            .subscribe((status, err) => {
                if (subscriptionStatusRequiresErrorMessage(status, err, "audit_log")) {
                    setErrorMessage("Error fetching data, please reload");
                }
            });

        return () => {
            void supabase.removeChannel(subscriptionChannel);
        };
    }, [fetchAndDisplayAuditLog]);

    return (
        <>
            {errorMessage && <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>}
            <Table
                dataPortion={auditLogDataPortion}
                headerKeysAndLabels={auditLogTableHeaderKeysAndLabels}
                defaultShownHeaders={[
                    "action",
                    "createdAt",
                    "userId",
                    "content",
                    "wasSuccess",
                    "logId",
                ]}
                toggleableHeaders={[
                    "parcelId",
                    "clientId",
                    "eventId",
                    "listId",
                    "collectionCentreId",
                    "profileId",
                    "packingSlotId",
                    "listHotelId",
                    "statusOrder",
                    "websiteData",
                ]}
                columnDisplayFunctions={auditLogTableColumnDisplayFunctions}
                paginationConfig={{
                    enablePagination: true,
                    filteredCount: auditLogCount,
                    onPageChange: setCurrentPage,
                    onPerPageChange: setAuditLogCountPerPage,
                    defaultRowsPerPage: defaultNumberOfAuditLogRowsPerPage,
                    rowsPerPageOptions: numberOfAuditLogRowsPerPageOption,
                }}
                checkboxConfig={{ displayed: false }}
                sortConfig={{
                    sortPossible: true,
                    sortableColumns: sortableColumns,
                    setSortState: setSortState,
                }}
                editableConfig={{
                    editable: false,
                }}
                filterConfig={{
                    primaryFiltersShown: false,
                    additionalFiltersShown: false,
                }}
            />
        </>
    );
};

export default AuditLogTable;
