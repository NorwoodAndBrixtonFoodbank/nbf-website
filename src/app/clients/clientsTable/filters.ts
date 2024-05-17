import { buildServerSideTextFilter } from "@/components/Tables/TextFilter";
import clientsHeaders from "./headers";
import { ClientsFilter, ClientsFilterMethod } from "./types";
import { nullPostcodeDisplay } from "@/common/format";

const fullNameSearch: ClientsFilterMethod = (query, state) =>
    query.ilike("full_name", `%${state}%`);

const postcodeSearch: ClientsFilterMethod = (query, state) => {
    if (state === "") {
        return query;
    }
    if (nullPostcodeDisplay.toLowerCase().includes(state.toLowerCase())) {
        return query.or(`address_postcode.ilike.%${state}%, address_postcode.is.null`);
    }
    return query.ilike("address_postcode", `%${state}%`);
};

const phoneNumberSearch: ClientsFilterMethod = (query, state) =>
    query.ilike("phone_number", `%${state}%`);

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
