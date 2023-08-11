import supabase, { Schema } from "@/supabase";
import { Datum } from "@/components/Tables/Table";

export interface ClientsTableRow extends Datum {
    parcelId: Schema["parcels"]["primary_key"];
    flaggedForAttention: boolean;
    requiresFollowUpPhoneCall: boolean;
    fullName: Schema["clients"]["full_name"];
    familyCategory: string;
    addressPostcode: Schema["clients"]["address_postcode"];
    collectionCentre: string;
    congestionChargeApplies: boolean;
    packingTimeLabel: string;
    lastStatus: string;
}

export type ProcessingData = Awaited<ReturnType<typeof getProcessingData>>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getProcessingData = async () => {
    const response = await supabase
        .from("parcels")
        .select(
            `
        parcel_id:primary_key,
        collection_centre,
        collection_datetime,
        packing_datetime,
        
        client:clients (
            full_name,
            address_postcode,
            flagged_for_attention,
            signposting_call_required,
            
            family:families (
                age,
                gender
            )
        ),
        
        events (
            event_name,
            timestamp
        )
    `
        )
        .order("packing_datetime", { ascending: false })
        .order("timestamp", { ascending: false, foreignTable: "events" })
        .limit(1, { foreignTable: "events" });

    return response.data ?? [];
};

export const processingDataToClientsTableData = async (
    processingData: ProcessingData
): Promise<ClientsTableRow[]> => {
    const clientTableRows = [];
    const congestionChargeDetails = await getCongestionChargeDetails(processingData);

    for (let index = 0; index < processingData.length; index++) {
        const parcel = processingData[index];
        const client = parcel.client!;

        clientTableRows.push({
            parcelId: parcel.parcel_id,
            flaggedForAttention: client.flagged_for_attention,
            requiresFollowUpPhoneCall: client.signposting_call_required,
            fullName: client.full_name,
            familyCategory: familyCountToFamilyCategory(client.family.length),
            addressPostcode: client.address_postcode,
            collectionCentre: parcel.collection_centre ?? "-",
            congestionChargeApplies: congestionChargeDetails[index].congestionCharge,
            packingDate: formatDatetimeAsDate(parcel.packing_datetime),
            packingTimeLabel: datetimeToPackingTimeLabel(parcel.packing_datetime),
            lastStatus: eventToStatusMessage(parcel.events[0] ?? null),
        });
    }

    return clientTableRows;
};

export const getCongestionChargeDetails = async (
    processingData: ProcessingData
): Promise<{ postcode: string; congestionCharge: boolean }[]> => {
    const postcodes = [];
    for (const parcel of processingData) {
        postcodes.push(parcel.client!.address_postcode);
    }

    const response = await supabase.functions.invoke("check-congestion-charge", {
        body: { postcodes: postcodes },
    });

    return JSON.parse(response.data);
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
        return "-";
    }

    return new Date(datetime).toLocaleDateString("en-GB");
};

export const datetimeToPackingTimeLabel = (datetime: string | null): string => {
    if (datetime === null || isNaN(Date.parse(datetime))) {
        return "-";
    }

    return new Date(datetime).getHours() <= 11 ? "AM" : "PM";
};

export const eventToStatusMessage = (
    event: Pick<Schema["events"], "event_name" | "timestamp"> | null
): string => {
    if (event === null) {
        return "-";
    }

    return `${event.event_name} @ ${formatDatetimeAsDate(event.timestamp)}`;
};

export const getClientsTableData = async (): Promise<ClientsTableRow[]> => {
    const processingData = await getProcessingData();
    return processingDataToClientsTableData(processingData);
};
