import { PaginationType } from "@/components/Tables/Filters";
import { SortOptions } from "@/components/Tables/Table";
import { ParcelsTableRow, DbParcelRow } from "./types";

const parcelsSortableColumns: SortOptions<ParcelsTableRow, DbParcelRow>[] = [
    {
        key: "fullName",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("client_full_name", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "familyCategory",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("family_count", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "addressPostcode",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("client_address_postcode", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "phoneNumber",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("client_phone_number", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "voucherNumber",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("voucher_number", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "deliveryCollection",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("collection_centre_name", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "packingDate",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query
                    .order("packing_date", { ascending: sortDirection === "asc" })
                    .order("packing_slot_order")
                    .order("client_full_name"),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "packingSlot",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("packing_slot_order", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "lastStatus",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("last_status_workflow_order", { ascending: sortDirection === "asc" }),
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
];

export default parcelsSortableColumns;
