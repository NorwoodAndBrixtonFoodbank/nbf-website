import { ServerSideFilterMethod } from "@/components/Tables/Filters";
import { nullPostcodeDisplay } from "./format";
import { DbClientRow, DbParcelRow } from "@/databaseUtils";

export const fullNameSearch = <DbData extends DbClientRow | DbParcelRow>(
    columnLabel: Extract<keyof DbData, "full_name" | "client_full_name">
): ServerSideFilterMethod<DbData, string> => {
    return (query, state) => query.ilike(`${columnLabel}`, `%${state}%`);
};

export const postcodeSearch = <DbData extends DbClientRow | DbParcelRow>(
    columnLabel: Extract<keyof DbData, "address_postcode" | "client_address_postcode">
): ServerSideFilterMethod<DbData, string> => {
    return (query, state) => {
        if (state === "") {
            return query;
        }
        if (nullPostcodeDisplay.toLowerCase().includes(state.toLowerCase())) {
            return query.or(
                `${columnLabel}.ilike.%${state}%, ${columnLabel}.is.null`
            );
        }
        return query.ilike(`${columnLabel}`, `%${state}%`);
    };
};

export const phoneSearch = <DbData extends DbClientRow | DbParcelRow>(
    columnLabel: Extract<keyof DbData, "phone_number" | "client_phone_number">
): ServerSideFilterMethod<DbData, string> => {
    return (query, state) => query.ilike(`${columnLabel}`, `%${state}%`);
};
