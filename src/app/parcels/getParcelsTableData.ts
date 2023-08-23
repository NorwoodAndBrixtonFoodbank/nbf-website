import { CongestionChargeDetails, ProcessingData } from "@/app/parcels/fetchDataFromServer";
import { Schema } from "@/database_utils";
import { Datum } from "@/components/Tables/Table";
import {
    familyCountToFamilyCategory,
    formatDatetimeAsDate,
} from "@/app/parcels/getExpandedParcelDetails";

export interface ParcelsTableRow extends Datum {
    primaryKey: string;
    parcelId: Schema["parcels"]["primary_key"];
    flaggedForAttention: boolean;
    requiresFollowUpPhoneCall: boolean;
    fullName: Schema["clients"]["full_name"];
    familyCategory: string;
    addressPostcode: Schema["clients"]["address_postcode"];
    collectionCentre: string;
    congestionChargeApplies: boolean;
    packingTimeLabel: string;
    collectionDatetime: string;
    lastStatus: string;
}

export const processingDataToClientsTableData = (
    processingData: ProcessingData,
    congestionCharge: CongestionChargeDetails[]
): ParcelsTableRow[] => {
    const clientTableRows: ParcelsTableRow[] = [];

    if (processingData.length !== congestionCharge.length) {
        throw new Error(
            `Invalid inputs, got length ${processingData.length} and ${congestionCharge.length}`
        );
    }

    for (let index = 0; index < processingData.length; index++) {
        const parcel = processingData[index];
        const client = parcel.client!;

        clientTableRows.push({
            primaryKey: client.primary_key,
            parcelId: parcel.parcel_id,
            flaggedForAttention: client.flagged_for_attention,
            requiresFollowUpPhoneCall: client.signposting_call_required,
            fullName: client.full_name,
            familyCategory: familyCountToFamilyCategory(client.family.length),
            addressPostcode: client.address_postcode,
            collectionCentre: parcel.collection_centre ?? "-",
            congestionChargeApplies: congestionCharge[index].congestionCharge,
            packingDate: formatDatetimeAsDate(parcel.packing_datetime),
            packingTimeLabel: datetimeToPackingTimeLabel(parcel.packing_datetime),
            collectionDatetime: parcel.collection_datetime ?? "-",
            lastStatus: eventToStatusMessage(parcel.events[0] ?? null),
        });
    }

    return clientTableRows;
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
