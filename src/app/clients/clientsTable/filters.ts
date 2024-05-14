import { buildServerSideTextFilter } from "@/components/Tables/TextFilter";
import clientsHeaders from "./headers";
import { ClientsFilter, ClientsFilterMethod } from "./types";

const fullNameSearch: ClientsFilterMethod = (query, state) =>
    query.ilike("full_name", `%${state}%`);

const clientsFilters: ClientsFilter[] = [
    buildServerSideTextFilter({
        key: "fullName",
        label: "Name",
        headers: clientsHeaders,
        method: fullNameSearch,
    }),
];

export default clientsFilters;
