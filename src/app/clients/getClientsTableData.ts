import supabase, { Schema } from "@/supabase";
import { Datum } from "@/components/Tables/Table";

// TODO Add filters from table to request
// TODO Paginate data over requests and refactor <Table /> component to handle this
// TODO Trim table column headers on mobile / display differently
// TODO Remove any 'any' types

// TODO Prune unnecessary fields

// interface ProcessingData {
//     parcel_id: string;
//     client_id: string;
//     collection_centre: string | null;
//     collection_datetime: string | null;
//     packing_datetime: string | null;
//
//     client: {
//         client_id: string;
//         family_id: string;
//         full_name: string;
//         address_postcode: string;
//         flagged_for_attention: boolean;
//         signposting_call_required: boolean;
//
//         family: {
//             family_id: string;
//             person_type: string;
//             quantity: number;
//         }[];
//     };
//
//     events: {
//         event_id: string;
//         parcel_id: string;
//         event_name: string;
//         timestamp: string;
//     }[];
// }

// type clientPart = Pick<Schema["clients"], "primary_key" | "family_id" | "full_name" | "address_postcode" | "flagged_for_attention" | "signposting_call_required">;
//
// type Test = Pick<Schema["parcels"],
//     "primary_key"| "client_id" | "collection_centre" | "collection_datetime" | "packing_datetime"> &
//     {client: clientPart}
//
// };

// TODO Info needed for table
export interface ClientTableRow extends Datum {
    parcelId: Schema["parcels"]["primary_key"];

    flaggedForAttention: boolean;
    requiresFollowUpPhoneCall: boolean;

    fullName: Schema["clients"]["full_name"];
    familyCategory: string;
    addressPostcode: Schema["clients"]["address_postcode"];

    collectionCentre: Schema["parcels"]["collection_centre"];
    congestionChargeApplies: boolean;

    packingTimeLabel: string;
    lastStatus: string;
}

type ProcessingData = Awaited<ReturnType<typeof getProcessingData>>;

// TODO remove export statement
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getProcessingData = async () => {
    const response = await supabase
        .from("parcels")
        .select(
            `
        parcel_id:primary_key,
        client_id,
        collection_centre,
        collection_datetime,
        packing_datetime,
        
        client:clients (
            client_id:primary_key,
            family_id,
            full_name,
            address_postcode,
            flagged_for_attention,
            signposting_call_required,
            
            family:families (
                family_id,
                age,
                gender
            )
        ),
        
        events (
            event_id:primary_key,
            parcel_id,
            event_name,
            timestamp
        )
    `
        )
        .order("packing_datetime", { ascending: false })
        .order("timestamp", { ascending: false, foreignTable: "events" })
        .limit(1, { foreignTable: "events" });

    return response.data ?? []; // TODO Handle this error
};

// TODO Change to actual headers of table - currently used in debugging
const processingDataToClientTableData = async (
    processingData: ProcessingData
): Promise<ClientTableRow[]> => {
    const clientTableRows = [];

    for (const parcel of processingData) {
        const client = parcel.client!;
        const congestionChargeApplies = await congestionChargeAppliesTo(client.address_postcode); // TODO Perform Computation in bulk to improve performance

        clientTableRows.push({
            parcelId: parcel.parcel_id,
            flaggedForAttention: client.flagged_for_attention,
            requiresFollowUpPhoneCall: client.signposting_call_required,
            fullName: client.full_name,
            familyCategory: familyCountToFamilyCategory(client.family.length),
            addressPostcode: client.address_postcode,
            collectionCentre: parcel.collection_centre,
            congestionChargeApplies: congestionChargeApplies,
            packingDate: formatDatetimeAsDate(parcel.packing_datetime),
            packingTimeLabel: datetimeToPackingTimeLabel(parcel.packing_datetime),
            lastStatus: eventToStatusMessage(parcel.events[0] ?? null), // TODO Change this
        });
    }

    return clientTableRows;
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

export const formatDatetimeAsDate = (datetime: string | null): string => {
    if (datetime === null || isNaN(Date.parse(datetime))) {
        return "-"; // TODO Change to setting as display only?
    }

    const date = new Date(datetime);

    const day = date.getDate();
    const month = date.getMonth();

    const DD = day < 10 ? "0" + day : day;
    const MM = month < 10 ? "0" + month : month;
    const YYYY = date.getFullYear();

    return `${DD}/${MM}/${YYYY}`;
};

const datetimeToPackingTimeLabel = (datetime: string | null): string => {
    if (datetime === null || isNaN(Date.parse(datetime))) {
        return "-";
    }

    return new Date(datetime).getHours() <= 11 ? "AM" : "PM";
};

const eventToStatusMessage = (
    event: Pick<Schema["events"], "event_name" | "timestamp"> | null
): string => {
    if (event === null) {
        return "-";
    }

    return `${event.event_name} @ ${formatDatetimeAsDate(event.timestamp)}`;
};

const congestionChargeAppliesTo = async (
    postcode: Schema["clients"]["address_postcode"]
): Promise<boolean> => {
    // TODO Handle on error?
    const response = await supabase.functions.invoke("check-congestion-charge", {
        body: { postcodes: [postcode] },
    });

    return JSON.parse(response.data)[0].congestionCharge;
};

export const getClientsTableData = async (): Promise<ClientTableRow[]> => {
    const processingData = await getProcessingData();
    return processingDataToClientTableData(processingData);
};
