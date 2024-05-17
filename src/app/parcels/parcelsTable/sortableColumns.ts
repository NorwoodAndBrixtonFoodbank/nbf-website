import { SortOptions } from "@/components/Tables/Table";
import { ParcelsTableRow, ParcelsSortMethod } from "./types";

const parcelsSortableColumns: SortOptions<ParcelsTableRow, ParcelsSortMethod>[] = [
    {
        key: "fullName",
        sortMethod: (query, sortDirection) =>
            query.order("client_full_name", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familyCategory",
        sortMethod: (query, sortDirection) =>
            query.order("family_count", { ascending: sortDirection === "asc" }),
    },
    {
        key: "addressPostcode",
        sortMethod: (query, sortDirection) =>
            query.order("client_address_postcode", { ascending: sortDirection === "asc" }),
    },
    {
        key: "phoneNumber",
        sortMethod: (query, sortDirection) =>
            query.order("client_phone_number", { ascending: sortDirection === "asc" }),
    },
    {
        key: "voucherNumber",
        sortMethod: (query, sortDirection) =>
            query.order("voucher_number", { ascending: sortDirection === "asc" }),
    },
    {
        key: "deliveryCollection",
        sortMethod: (query, sortDirection) =>
            query.order("collection_centre_name", { ascending: sortDirection === "asc" }),
    },
    {
        key: "packingDate",
        sortMethod: (query, sortDirection) =>
            query
                .order("packing_date", { ascending: sortDirection === "asc" })
                .order("packing_slot_order")
                .order("is_delivery", { ascending: !(sortDirection === "desc" || sortDirection === "asc")})
                .order("client_address_postcode"),
    },
    {
        key: "packingSlot",
        sortMethod: (query, sortDirection) =>
            query.order("packing_slot_order", { ascending: sortDirection === "asc" }),
    },
    {
        key: "lastStatus",
        sortMethod: (query, sortDirection) =>
            query.order("last_status_workflow_order", { ascending: sortDirection === "asc" }),
    },
    {
        key: "createdAt",
        sortMethod: (query, sortDirection) =>
            query.order("created_at", { ascending: sortDirection === "asc" }),
    },
];

export default parcelsSortableColumns;
