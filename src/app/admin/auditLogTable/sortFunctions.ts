import { SortOptions } from "@/components/Tables/Table";
import { AuditLogRow } from "./types";
import { PaginationType } from "@/components/Tables/Filters";

export const auditLogTableSortableColumns: SortOptions<AuditLogRow>[] = [
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
