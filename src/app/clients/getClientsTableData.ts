import { CongestionChargeDetails, ProcessingData } from "@/app/clients/fetchDataFromServer";
import { Schema } from "@/database_utils";
import { Status } from "@/app/clients/ActionBar";
import {
    familyCountToFamilyCategory,
    formatDatetimeAsDate,
} from "@/app/clients/getExpandedClientDetails";

export interface ParcelsTableRow {
    parcelId: Schema["parcels"]["primary_key"];
    primaryKey: Schema["clients"]["primary_key"];
    fullName: Schema["clients"]["full_name"];
    familyCategory: string;
    addressPostcode: Schema["clients"]["address_postcode"];
    deliveryCollection: {
        collectionCentre: Schema["parcels"]["collection_centre"];
        congestionChargeApplies: boolean;
    };
    packingTimeLabel: string;
    collectionDatetime: Date | null;
    lastStatus: Status;
    voucherNumber: Schema["parcels"]["voucher_number"];
    iconsColumn: {
        flaggedForAttention: Schema["clients"]["flagged_for_attention"];
        requiresFollowUpPhoneCall: Schema["clients"]["signposting_call_required"];
    };
    packingDatetime: Date | null;
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
            parcelId: parcel.parcel_id,
            primaryKey: client.primary_key,
            fullName: client.full_name,
            familyCategory: familyCountToFamilyCategory(client.family.length),
            addressPostcode: client.address_postcode,
            deliveryCollection: {
                collectionCentre: parcel.collection_centre ?? "-",
                congestionChargeApplies: congestionCharge[index].congestionCharge,
            },
            collectionDatetime: parcel.collection_datetime
                ? new Date(parcel.collection_datetime)
                : null,
            packingTimeLabel: datetimeToPackingTimeLabel(parcel.packing_datetime),
            lastStatus: eventToStatusMessage(parcel.events[0] ?? null) as Status,
            voucherNumber: parcel.voucher_number,
            packingDatetime: parcel.packing_datetime ? new Date(parcel.packing_datetime) : null,
            iconsColumn: {
                flaggedForAttention: client.flagged_for_attention,
                requiresFollowUpPhoneCall: client.signposting_call_required,
            },
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
