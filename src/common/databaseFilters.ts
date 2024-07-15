import { ServerSideFilterMethod } from "@/components/Tables/Filters";
import { displayPostcodeForHomelessClient } from "./format";
import { DbClientRow, DbParcelRow } from "@/databaseUtils";
import { parcelsPageDeletedClientDisplayName } from "@/app/parcels/parcelsTable/format";

export const fullNameSearch = <DbData extends DbClientRow | DbParcelRow>(
    fullNameColumnLabel: Extract<keyof DbData, "full_name" | "client_full_name">,
    clientIsActiveColumnLabel: Extract<keyof DbData, "is_active" | "client_is_active">
): ServerSideFilterMethod<DbData, string> => {
    return (query, state) => {
        const cleanState = state.replace(/[^a-zA-Z0-9 ]/g, "");
        if (cleanState === "") {
            return query;
        }
        if (parcelsPageDeletedClientDisplayName.toLowerCase().includes(cleanState.toLowerCase())) {
            return query.or(
                `${fullNameColumnLabel}.ilike.%${cleanState}%, ${clientIsActiveColumnLabel}.eq.false`
            );
        }
        return query.ilike(fullNameColumnLabel, `%${cleanState}%`);
    };
};

export const postcodeSearch = <DbData extends DbClientRow | DbParcelRow>(
    postcodeColumnLabel: Extract<keyof DbData, "address_postcode" | "client_address_postcode">,
    clientIsActiveColumnLabel: Extract<keyof DbData, "is_active" | "client_is_active">
): ServerSideFilterMethod<DbData, string> => {
    return (query, state) => {
        if (state === "") {
            return query;
        }
        if (state === "-") {
            return query.is(clientIsActiveColumnLabel, false);
        }
        if (displayPostcodeForHomelessClient.toLowerCase().includes(state.toLowerCase())) {
            return query
                .or(`${postcodeColumnLabel}.ilike.%${state}%, ${postcodeColumnLabel}.is.null`)
                .neq(clientIsActiveColumnLabel, false);
        }
        return query.ilike(postcodeColumnLabel, `%${state}%`);
    };
};

export const phoneSearch = <DbData extends DbClientRow | DbParcelRow>(
    phoneColumnLabel: Extract<keyof DbData, "phone_number" | "client_phone_number">,
    clientIsActiveColumnLabel: Extract<keyof DbData, "is_active" | "client_is_active">
): ServerSideFilterMethod<DbData, string> => {
    return (query, state) => {
        if (state === "") {
            return query;
        }
        if ("-".includes(state.toLowerCase())) {
            return query.or(
                `${phoneColumnLabel}.ilike.%${state}%, ${clientIsActiveColumnLabel}.eq.false`
            );
        }
        return query.ilike(phoneColumnLabel, `%${state}%`);
    };
};
