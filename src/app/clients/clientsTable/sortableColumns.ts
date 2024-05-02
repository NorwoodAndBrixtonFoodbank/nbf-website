import { PaginationType } from "@/components/Tables/Filters";
import { SortOptions } from "@/components/Tables/Table";
import { ClientsTableRow, DbClientRow } from "./types";
const clientsSortableColumns: SortOptions<ClientsTableRow, DbClientRow>[] = [
    {
        key: "fullName",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("full_name", { ascending: sortDirection === "asc" }),
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
                query.order("address_postcode", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
];

export default clientsSortableColumns;
