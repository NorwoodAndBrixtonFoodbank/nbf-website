import { formatDateTime, formatBoolean, formatJson } from "@/common/format";
import { PaginationType } from "@/components/Tables/Filters";
import { TableHeaders, SortOptions } from "@/components/Tables/Table";
import { AuditLogError, AuditLogCountError } from "./fetchAuditLogData";
import { Schema } from "@/databaseUtils";
import { Json } from "@/databaseTypesFile";

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

export const auditLogTableHeaderKeysAndLabels: TableHeaders<AuditLogRow> = [
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

export const auditLogTableColumnDisplayFunctions = {
    createdAt: formatDateTime,
    wasSuccess: formatBoolean,
    content: formatJson,
};

export const sortableColumns: SortOptions<AuditLogRow>[] = [
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

export const getAuditLogErrorMessage = (error: AuditLogError | AuditLogCountError): string => {
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

export const defaultNumberOfAuditLogRowsPerPage = 10;
export const numberOfAuditLogRowsPerPageOption = [10, 25, 50, 100];

export const convertAuditLogResponseToAuditLogRow = (
    auditLogResponse: Schema["audit_log"][]
): AuditLogRow[] =>
    auditLogResponse.map((auditLogResponseRow) => ({
        action: auditLogResponseRow.action ?? "",
        clientId: auditLogResponseRow.client_id ?? "",
        collectionCentreId: auditLogResponseRow.collection_centre_id ?? "",
        content: auditLogResponseRow.content ?? "",
        createdAt: auditLogResponseRow.created_at ?? "",
        eventId: auditLogResponseRow.event_id ?? "",
        listHotelId: auditLogResponseRow.list_hotel_id ?? "",
        listId: auditLogResponseRow.list_id ?? "",
        logId: auditLogResponseRow.log_id ?? "",
        packingSlotId: auditLogResponseRow.packing_slot_id ?? "",
        parcelId: auditLogResponseRow.parcel_id ?? "",
        profileId: auditLogResponseRow.profile_id ?? "",
        statusOrder: auditLogResponseRow.status_order ?? "",
        userId: auditLogResponseRow.user_id ?? "",
        wasSuccess: auditLogResponseRow.wasSuccess ?? "",
        websiteData: auditLogResponseRow.website_data ?? "",
    }));
