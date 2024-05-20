import { buildServerSideTextFilter } from "@/components/Tables/TextFilter";
import clientsHeaders from "./headers";
import { ClientsFilter, ClientsFilterMethod } from "./types";
import {
    fullNameMethodHelper,
    phoneNumberMethodHelper,
    postcodeMethodHelper,
} from "@/common/databaseFilters";
import { DbClientRow } from "@/databaseUtils";

const fullNameSearch: ClientsFilterMethod = fullNameMethodHelper<DbClientRow>("full_name");

const postcodeSearch: ClientsFilterMethod = postcodeMethodHelper<DbClientRow>("address_postcode");

const phoneNumberSearch: ClientsFilterMethod = phoneNumberMethodHelper<DbClientRow>("phone_number");

const clientsFilters: ClientsFilter[] = [
    buildServerSideTextFilter({
        key: "fullName",
        label: "Name",
        headers: clientsHeaders,
        method: fullNameSearch,
    }),
    buildServerSideTextFilter({
        key: "addressPostcode",
        label: "Postcode",
        headers: clientsHeaders,
        method: postcodeSearch,
    }),
    buildServerSideTextFilter({
        key: "phoneNumber",
        label: "Phone",
        headers: clientsHeaders,
        method: phoneNumberSearch,
    }),
];

export default clientsFilters;
