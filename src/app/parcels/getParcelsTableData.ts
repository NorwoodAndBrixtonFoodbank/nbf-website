import { CongestionChargeDetails, ParcelProcessingData } from "@/app/parcels/fetchParcelTableData";
import { familyCountToFamilyCategory } from "@/app/parcels/getExpandedParcelDetails";
import { Schema } from "@/databaseUtils";

export interface ParcelsTableRow {
    parcelId: Schema["parcels"]["primary_key"];
    primaryKey: Schema["clients"]["primary_key"];
    fullName: Schema["clients"]["full_name"];
    familyCategory: string;
    addressPostcode: Schema["clients"]["address_postcode"];
    phoneNumber: Schema["clients"]["phone_number"];
    deliveryCollection: {
        collectionCentreName: string;
        collectionCentreAcronym: string;
        congestionChargeApplies: boolean;
    };
    packingTimeLabel: PackingTimeLabel | null;
    collectionDatetime: Date | null;
    lastStatus: {
        name: string;
        timestamp: Date;
        eventData: string | null;
    } | null;
    voucherNumber: string | null;
    iconsColumn: {
        flaggedForAttention: boolean;
        requiresFollowUpPhoneCall: boolean;
    };
    packingDatetime: Date | null;
}

export const processingDataToParcelsTableData = (
    processingData: ParcelProcessingData,
    congestionCharge: CongestionChargeDetails[]
): ParcelsTableRow[] => {
    const parcelTableRows: ParcelsTableRow[] = [];

    if (processingData.length !== congestionCharge.length) {
        throw new Error(
            `Invalid inputs, got length ${processingData.length} and ${congestionCharge.length}`
        );
    }

    for (let index = 0; index < processingData.length; index++) {
        const parcel = processingData[index];
        const client = parcel.client!;

        parcelTableRows.push({
            parcelId: parcel.parcel_id,
            primaryKey: client.primary_key,
            fullName: client.full_name,
            familyCategory: familyCountToFamilyCategory(client.family.length),
            addressPostcode: client.address_postcode,
            phoneNumber: client.phone_number,
            deliveryCollection: {
                collectionCentreName: parcel.collection_centre?.name ?? "-",
                collectionCentreAcronym: parcel.collection_centre?.acronym ?? "-",
                congestionChargeApplies: congestionCharge[index].congestionCharge,
            },
            collectionDatetime: parcel.collection_datetime
                ? new Date(parcel.collection_datetime)
                : null,
            packingTimeLabel: datetimeToPackingTimeLabel(parcel.packing_datetime),
            lastStatus: eventToLastStatus(parcel.events[0] ?? null),
            voucherNumber: parcel.voucher_number,
            packingDatetime: parcel.packing_datetime ? new Date(parcel.packing_datetime) : null,
            iconsColumn: {
                flaggedForAttention: client.flagged_for_attention,
                requiresFollowUpPhoneCall: client.signposting_call_required,
            },
        });
    }

    return parcelTableRows;
};

export type PackingTimeLabel = "AM" | "PM";

export const datetimeToPackingTimeLabel = (datetime: string | null): PackingTimeLabel | null => {
    if (datetime === null || isNaN(Date.parse(datetime))) {
        return null;
    }

    return new Date(datetime).getHours() <= 11 ? "AM" : "PM";
};

export const eventToLastStatus = (
    event: Pick<Schema["events"], "event_name" | "timestamp" | "event_data"> | undefined | null
): ParcelsTableRow["lastStatus"] => {
    if (!event) {
        return null;
    }

    return {
        name: event.event_name,
        eventData: event.event_data,
        timestamp: new Date(event.timestamp),
    };
};
