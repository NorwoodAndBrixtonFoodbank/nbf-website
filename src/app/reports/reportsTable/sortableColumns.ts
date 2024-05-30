import { SortOptions } from "@/components/Tables/Table";

const reportsSortableColumns: SortOptions<any, any>[] = [
    {
        key: "weekCommencing",
        sortMethod: (query: any, sortDirection: any) =>
            query.order("week_commencing", { ascending: sortDirection === "asc" }),
    },
    {
        key: "total",
        sortMethod: (query: any, sortDirection: any) =>
            query.order("total_parcels", { ascending: sortDirection === "asc" }),
    },
];

export default reportsSortableColumns;
