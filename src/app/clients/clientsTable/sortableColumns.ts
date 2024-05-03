import { SortOptions } from "@/components/Tables/Table";
import { ClientsSortMethod, ClientsTableRow } from "./types";
const clientsSortableColumns: SortOptions<ClientsTableRow, ClientsSortMethod>[] = [
    {
        key: "fullName",
        sortMethod: (query, sortDirection) =>
            query.order("full_name", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familyCategory",
        sortMethod: (query, sortDirection) =>
            query.order("family_count", { ascending: sortDirection === "asc" }),
    },
    {
        key: "addressPostcode",
        sortMethod: (query, sortDirection) =>
            query.order("address_postcode", { ascending: sortDirection === "asc" }),
    },
];

export default clientsSortableColumns;
