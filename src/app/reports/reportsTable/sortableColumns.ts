import { SortOptions } from "@/components/Tables/Table";
import { ReportsSortMethod, ReportsTableRow } from "@/app/reports/reportsTable/types";

const reportsSortableColumns: SortOptions<ReportsTableRow, ReportsSortMethod>[] = [
    {
        key: "weekCommencing",
        sortMethod: (query, sortDirection) =>
            query.order("week_commencing", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familySize1",
        sortMethod: (query, sortDirection) =>
            query.order("family_size_1", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familySize2",
        sortMethod: (query, sortDirection) =>
            query.order("family_size_2", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familySize3",
        sortMethod: (query, sortDirection) =>
            query.order("family_size_3", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familySize4",
        sortMethod: (query, sortDirection) =>
            query.order("family_size_4", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familySize5",
        sortMethod: (query, sortDirection) =>
            query.order("family_size_5", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familySize6",
        sortMethod: (query, sortDirection) =>
            query.order("family_size_6", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familySize7",
        sortMethod: (query, sortDirection) =>
            query.order("family_size_7", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familySize8",
        sortMethod: (query, sortDirection) =>
            query.order("family_size_8", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familySize9",
        sortMethod: (query, sortDirection) =>
            query.order("family_size_9", { ascending: sortDirection === "asc" }),
    },
    {
        key: "familySize10Plus",
        sortMethod: (query, sortDirection) =>
            query.order("family_size_10_plus", { ascending: sortDirection === "asc" }),
    },
    {
        key: "total",
        sortMethod: (query, sortDirection) =>
            query.order("total_parcels", { ascending: sortDirection === "asc" }),
    },
    {
        key: "cat",
        sortMethod: (query, sortDirection) =>
            query.order("cat", { ascending: sortDirection === "asc" }),
    },
    {
        key: "dog",
        sortMethod: (query, sortDirection) =>
            query.order("dog", { ascending: sortDirection === "asc" }),
    },
    {
        key: "catAndDog",
        sortMethod: (query, sortDirection) =>
            query.order("cat_and_dog", { ascending: sortDirection === "asc" }),
    },
    {
        key: "totalWithPets",
        sortMethod: (query, sortDirection) =>
            query.order("total_with_pets", { ascending: sortDirection === "asc" }),
    },
];

export default reportsSortableColumns;
