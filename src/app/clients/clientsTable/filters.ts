import { buildServerSideTextFilter } from "@/components/Tables/TextFilter";
import clientsHeaders from "./headers";
import { ClientsFilter, ClientsFilterMethod } from "./types";
import { fullNameSearch, phoneSearch, postcodeSearch } from "@/common/databaseFilters";
import { DbClientRow } from "@/databaseUtils";

const clientFullNameSearch: ClientsFilterMethod = fullNameSearch<DbClientRow>("full_name");

const clientPostcodeSearch: ClientsFilterMethod = postcodeSearch<DbClientRow>("address_postcode");

const clientPhoneSearch: ClientsFilterMethod = phoneSearch<DbClientRow>("phone_number");

const clientsFilters: ClientsFilter[] = [
    buildServerSideTextFilter({
        key: "fullName",
        label: "Name",
        headers: clientsHeaders,
        method: clientFullNameSearch,
    }),
    buildServerSideTextFilter({
        key: "addressPostcode",
        label: "Postcode",
        headers: clientsHeaders,
        method: clientPostcodeSearch,
    }),
    buildServerSideTextFilter({
        key: "phoneNumber",
        label: "Phone",
        headers: clientsHeaders,
        method: clientPhoneSearch,
    }),
];

export default clientsFilters;
