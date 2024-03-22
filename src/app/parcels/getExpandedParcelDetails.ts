import { Schema } from "@/databaseUtils";
import { Data } from "@/components/DataViewer/DataViewer";
import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { EventTableRow } from "./EventTable";
import { logErrorReturnLogId } from "@/logger/logger";
export type RawParcelDetails = Awaited<ReturnType<typeof getRawParcelDetails>>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getRawParcelDetails = async (parcelId: string) => {
    const { data, error } = await supabase
        .from("parcels")
        .select(
            `
        voucher_number,
        packing_datetime,

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
        const logId = await logErrorReturnLogId("Error with fetch: Parcel", error);
        throw new DatabaseError("fetch", "parcel", logId);
    }
    return data;
};

export const familyCountToFamilyCategory = (count: number): string => {
    if (count <= 1) {
        return "Single";
    }

    if (count <= 9) {
        return `Family of ${count}`;
    }

    return "Family of 10+";
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

export interface ExpandedParcelData extends Data {
    voucherNumber: string;
    fullName: string;
    address: string;
    deliveryInstructions: string;
    phoneNumber: string;
    household: string;
    children: string;
    packingDate: string;
    packingTime: string;
    collection: string;
}

export interface ExpandedParcelDetails {
    expandedParcelData: ExpandedParcelData;
    events: EventTableRow[];
}

export const rawDataToExpandedParcelData = (
    rawParcelDetails: RawParcelDetails
): ExpandedParcelData => {
    if (rawParcelDetails === null) {
        return {
            voucherNumber: "",
            fullName: "",
            address: "",
            deliveryInstructions: "",
            phoneNumber: "",
            household: "",
            children: "",
            packingDate: "",
            packingTime: "",
            collection: "",
        };
    }

    const client = rawParcelDetails.client!;

    return {
        voucherNumber: rawParcelDetails.voucher_number ?? "",
        fullName: client.full_name,
        address: formatAddressFromClientDetails(client),
        deliveryInstructions: client.delivery_instructions,
        phoneNumber: client.phone_number,
        household: formatHouseholdFromFamilyDetails(client.family),
        children: formatBreakdownOfChildrenFromFamilyDetails(client.family),
        packingDate: formatDatetimeAsDate(rawParcelDetails.packing_datetime),
        packingTime: formatDatetimeAsTime(rawParcelDetails.packing_datetime),
        collection: rawParcelDetails.collection_centre?.name ?? "",
    };
};

export const formatDatetimeAsTime = (datetime: string | null): string => {
    if (datetime === null || isNaN(Date.parse(datetime))) {
        return "-";
    }

    return new Date(datetime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

export const formatAddressFromClientDetails = (
    client: Pick<
        Schema["clients"],
        "address_1" | "address_2" | "address_town" | "address_county" | "address_postcode"
    >
): string => {
    return [
        client.address_1,
        client.address_2,
        client.address_town,
        client.address_county,
        client.address_postcode,
    ]
        .filter((field) => field)
        .join(", ");
};

export const formatHouseholdFromFamilyDetails = (
    family: Pick<Schema["families"], "age" | "gender">[]
): string => {
    let adultCount = 0;
    let childCount = 0;

    for (const familyMember of family) {
        if (familyMember.age === null || familyMember.age >= 16) {
            adultCount++;
        } else {
            childCount++;
        }
    }

    const adultChildBreakdown = [];

    if (adultCount > 0) {
        adultChildBreakdown.push(`${adultCount} adult${adultCount > 1 ? "s" : ""}`);
    }

    if (childCount > 0) {
        adultChildBreakdown.push(`${childCount} child${childCount > 1 ? "ren" : ""}`);
    }

    const familyCategory = familyCountToFamilyCategory(family.length);
    const occupantDisplay = `Occupant${adultCount + childCount > 1 ? "s" : ""}`;

    return `${familyCategory} ${occupantDisplay} (${adultChildBreakdown.join(", ")})`;
};

export const formatBreakdownOfChildrenFromFamilyDetails = (
    family: Pick<Schema["families"], "age" | "gender">[]
): string => {
    const childDetails = [];

    for (const familyMember of family) {
        if (familyMember.age !== null && familyMember.age <= 15) {
            const age = familyMember.age === -1 ? "0-15" : familyMember.age.toString();
            childDetails.push(`${age}-year-old ${familyMember.gender}`);
        }
    }

    if (childDetails.length === 0) {
        return "No Children";
    }

    return childDetails.join(", ");
};

export const processEventsDetails = (
    events: Pick<Schema["events"], "event_data" | "event_name" | "timestamp">[]
): EventTableRow[] => {
    return events.map((event) => ({
        eventInfo: event.event_name + (event.event_data ? ` (${event.event_data})` : ""),
        timestamp: new Date(event.timestamp),
    }));
};

const getExpandedParcelDetails = async (parcelId: string): Promise<ExpandedParcelDetails> => {
    const rawParcelDetails = await getRawParcelDetails(parcelId);
    return {
        expandedParcelData: rawDataToExpandedParcelData(rawParcelDetails),
        events: processEventsDetails(rawParcelDetails.events),
    };
};

export default getExpandedParcelDetails;
