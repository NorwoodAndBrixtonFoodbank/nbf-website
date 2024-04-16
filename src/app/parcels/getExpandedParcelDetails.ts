import { Schema } from "@/databaseUtils";
import { Data } from "@/components/DataViewer/DataViewer";
import supabase from "@/supabaseClient";
import { EventTableRow } from "./EventTable";
import { logErrorReturnLogId } from "@/logger/logger";
import {
    formatAddressFromClientDetails,
    formatBreakdownOfChildrenFromFamilyDetails,
    formatHouseholdFromFamilyDetails,
} from "@/app/clients/getExpandedClientDetails";

type FetchExpandedParcelDetailsResult =
    | {
          parcelDetails: ExpandedParcelDetails;
          error: null;
      }
    | {
          parcelDetails: null;
          error: FetchExpandedParcelDetailsError;
      };

export interface FetchExpandedParcelDetailsError {
    type: FetchExpandedParcelDetailsErrorType;
    logId: string;
}

export type FetchExpandedParcelDetailsErrorType =
    | "failedToFetchParcelDetails"
    | "clientDetailDoesNotExist";

const getExpandedParcelDetails = async (
    parcelId: string
): Promise<FetchExpandedParcelDetailsResult> => {
    const { data: rawParcelDetails, error } = await supabase
        .from("parcels")
        .select(
            `
        voucher_number,
        packing_date,
        created_at,
        
        packing_slot: packing_slots (
            name
         ),
        collection_centre:collection_centres (
            name
         ),

        client:clients(
            primary_key,
            full_name,
            phone_number,
            delivery_instructions,
            address_1,
            address_2,
            address_town,
            address_county,
            address_postcode,

            family:families(
                age,
                gender
            )
        ),
        events:events (
            event_name,
            timestamp,
            event_data
        )
    `
        )
        .eq("primary_key", parcelId)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Failed to fetch expanded parcel details", {
            error,
        });
        return {
            parcelDetails: null,
            error: {
                type: "failedToFetchParcelDetails",
                logId,
            },
        };
    }

    const client = rawParcelDetails.client;

    if (client === null) {
        const logId = await logErrorReturnLogId(
            "Failed to fetch client details when fetching expanded parcel details",
            { dbParcelDetails: rawParcelDetails }
        );

        return {
            parcelDetails: null,
            error: {
                type: "clientDetailDoesNotExist",
                logId,
            },
        };
    }

    return {
        parcelDetails: {
            expandedParcelData: {
                voucherNumber: rawParcelDetails.voucher_number ?? "",
                fullName: client.full_name,
                address: formatAddressFromClientDetails(client),
                deliveryInstructions: client.delivery_instructions,
                phoneNumber: client.phone_number,
                household: formatHouseholdFromFamilyDetails(client.family),
                children: formatBreakdownOfChildrenFromFamilyDetails(client.family),
                packingDate: formatDatetimeAsDate(rawParcelDetails.packing_date),
                packingSlot: rawParcelDetails.packing_slot?.name ?? "",
                collection: rawParcelDetails.collection_centre?.name ?? "",
                createdAt: formatDateTime(rawParcelDetails.created_at),
            },
            events: processEventsDetails(rawParcelDetails.events),
        },
        error: null,
    };
};

export const formatDatetimeAsDate = (datetime: Date | string | null): string => {
    if (datetime instanceof Date) {
        return datetime.toLocaleDateString("en-GB");
    }

    if (datetime === null || isNaN(Date.parse(datetime))) {
        return "-";
    }

    return new Date(datetime).toLocaleDateString("en-GB");
};

export const formatDateTime = (datetime: Date | string | null): string => {
    if (datetime === null) {
        return "-";
    }

    const datetimeToFormat = datetime instanceof Date ? datetime : new Date(datetime);

    return datetimeToFormat.toLocaleString("en-GB");
};

export interface ExpandedParcelData extends Data {
    voucherNumber: string;
    fullName: string;
    address: string;
    deliveryInstructions: string;
    phoneNumber: string;
    household: string;
    children: string;
    packingDate: string;
    packingSlot: string;
    collection: string;
    createdAt: string;
}

export interface ExpandedParcelDetails {
    expandedParcelData: ExpandedParcelData;
    events: EventTableRow[];
}

export const formatDatetimeAsTime = (datetime: string | null): string => {
    if (datetime === null || isNaN(Date.parse(datetime))) {
        return "-";
    }

    return new Date(datetime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

export const processEventsDetails = (
    events: Pick<Schema["events"], "event_data" | "event_name" | "timestamp">[]
): EventTableRow[] => {
    return events.map((event) => ({
        eventInfo: event.event_name + (event.event_data ? ` (${event.event_data})` : ""),
        timestamp: new Date(event.timestamp),
    }));
};

export default getExpandedParcelDetails;
