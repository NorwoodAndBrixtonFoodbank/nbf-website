import { SortOptions } from "@/components/Tables/Table";
import { ParcelsTableRow, ParcelsSortMethod } from "./types";

export const defaultParcelsSort: ParcelsSortMethod = (query, sortDirection) =>
    query
        .order("packing_date", { ascending: sortDirection === "asc" })
        .order("packing_slot_order")
        .order("is_delivery", { ascending: false })
        .order("collection_centre_name")
        .order("client_is_active", { ascending: false })
        .order("client_address_postcode")
        .order("parcel_id");

export const defaultParcelsSortKey: string = "packingDate";

const parcelsSortableColumns: SortOptions<ParcelsTableRow, ParcelsSortMethod>[] = [
    {
        key: "fullName",
        sortMethod: (query, sortDirection) =>
            query
                .order("client_is_active", { ascending: sortDirection !== "asc" })
                .order("client_full_name", { ascending: sortDirection === "asc" })
                .order("packing_date")
                .order("packing_slot_order")
                .order("is_delivery", { ascending: false })
                .order("collection_centre_name")
                .order("client_address_postcode")
                .order("parcel_id"),
    },
    {
        key: "familyCategory",
        sortMethod: (query, sortDirection) =>
            query
                .order("client_is_active", { ascending: sortDirection !== "asc" })
                .order("family_count", { ascending: sortDirection === "asc" })
                .order("packing_date")
                .order("packing_slot_order")
                .order("is_delivery", { ascending: false })
                .order("collection_centre_name")
                .order("client_address_postcode")
                .order("parcel_id"),
    },
    {
        key: "addressPostcode",
        sortMethod: (query, sortDirection) =>
            query
                .order("client_is_active", { ascending: sortDirection !== "asc" })
                .order("client_address_postcode", { ascending: sortDirection === "asc" })
                .order("packing_date")
                .order("packing_slot_order")
                .order("is_delivery", { ascending: false })
                .order("collection_centre_name")
                .order("parcel_id"),
    },
    {
        key: "phoneNumber",
        sortMethod: (query, sortDirection) =>
            query
                .order("client_is_active", { ascending: sortDirection !== "asc" })
                .order("client_phone_number", { ascending: sortDirection === "asc" })
                .order("packing_date")
                .order("packing_slot_order")
                .order("is_delivery", { ascending: false })
                .order("collection_centre_name")
                .order("client_address_postcode")
                .order("parcel_id"),
    },
    {
        key: "voucherNumber",
        sortMethod: (query, sortDirection) =>
            query
                .order("voucher_number", { ascending: sortDirection === "asc" })
                .order("packing_date")
                .order("packing_slot_order")
                .order("is_delivery", { ascending: false })
                .order("collection_centre_name")
                .order("client_is_active", { ascending: sortDirection !== "asc" })
                .order("client_address_postcode")
                .order("parcel_id"),
    },
    {
        key: "deliveryCollection",
        sortMethod: (query, sortDirection) =>
            query
                .order("is_delivery", { ascending: sortDirection === "asc" })
                .order("collection_centre_name")
                .order("packing_date")
                .order("packing_slot_order")
                .order("client_is_active", { ascending: sortDirection !== "asc" })
                .order("client_address_postcode")
                .order("parcel_id"),
    },
    {
        key: "packingDate",
        sortMethod: defaultParcelsSort,
    },
    {
        key: "packingSlot",
        sortMethod: (query, sortDirection) =>
            query
                .order("packing_slot_order", { ascending: sortDirection === "asc" })
                .order("packing_date")
                .order("is_delivery", { ascending: false })
                .order("collection_centre_name")
                .order("client_is_active", { ascending: sortDirection !== "asc" })
                .order("client_address_postcode")
                .order("parcel_id"),
    },
    {
        key: "lastStatus",
        sortMethod: (query, sortDirection) =>
            query
                .order("last_status_workflow_order", { ascending: sortDirection === "asc" })
                .order("packing_date")
                .order("packing_slot_order")
                .order("is_delivery", { ascending: false })
                .order("collection_centre_name")
                .order("client_is_active", { ascending: sortDirection !== "asc" })
                .order("client_address_postcode")
                .order("parcel_id"),
    },
    {
        key: "createdAt",
        sortMethod: (query, sortDirection) =>
            query
                .order("created_at", { ascending: sortDirection === "asc" })
                .order("packing_date")
                .order("packing_slot_order")
                .order("is_delivery", { ascending: false })
                .order("collection_centre_name")
                .order("client_is_active", { ascending: sortDirection !== "asc" })
                .order("client_address_postcode")
                .order("parcel_id"),
    },
];

export default parcelsSortableColumns;
