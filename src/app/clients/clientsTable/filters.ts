import { buildServerSideTextFilter } from "@/components/Tables/TextFilter";
import clientsHeaders from "./headers";
import { ClientsFilter, ClientsFilterMethod } from "./types";
import { fullNameSearch, phoneSearch, postcodeSearch } from "@/common/databaseFilters";
import { DbClientRow } from "@/databaseUtils";

const clientsFullNameSearch: ClientsFilterMethod = fullNameSearch<DbClientRow>("full_name");

const clientsPostcodeSearch: ClientsFilterMethod = postcodeSearch<DbClientRow>("address_postcode");

const clientsPhoneSearch: ClientsFilterMethod = phoneSearch<DbClientRow>("phone_number");

const clientsFilters: ClientsFilter[] = [
    buildServerSideTextFilter({
        key: "fullName",
        label: "Name",
        headers: clientsHeaders,
        method: clientsFullNameSearch,
    }),
    buildServerSideTextFilter({
        key: "addressPostcode",
        label: "Postcode",
        headers: clientsHeaders,
        method: clientsPostcodeSearch,
    }),
    buildServerSideTextFilter({
        key: "phoneNumber",
        label: "Phone",
        headers: clientsHeaders,
        method: clientsPhoneSearch,
    }),
];

export default clientsFilters;
