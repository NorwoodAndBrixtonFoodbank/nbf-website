import { CongestionChargeDetails, ParcelProcessingData } from "@/app/parcels/fetchParcelTableData";
import { familyCountToFamilyCategory } from "@/app/clients/getExpandedClientDetails";
import { logErrorReturnLogId } from "@/logger/logger";
import { Schema, ViewSchema } from "@/databaseUtils";

export interface ParcelsTableRow {
    parcelId: Schema["parcels"]["primary_key"];
    clientId: Schema["clients"]["primary_key"];
    fullName: Schema["clients"]["full_name"];
    familyCategory: string;
    addressPostcode: Schema["clients"]["address_postcode"];
    phoneNumber: Schema["clients"]["phone_number"];
    deliveryCollection: {
        collectionCentreName: string;
        collectionCentreAcronym: string;
        congestionChargeApplies: boolean;
    };
    packingSlot: string | null;
    collectionDatetime: Date | null;
    lastStatus: {
        name: string;
        timestamp: Date;
        eventData: string | null;
        workflowOrder: number;
    } | null;
    voucherNumber: string | null;
    iconsColumn: {
        flaggedForAttention: boolean;
        requiresFollowUpPhoneCall: boolean;
    };
    packingDate: Date | null;
    createdAt: Date | null;
}

export const processingDataToParcelsTableData = async (
    processingData: ParcelProcessingData,
    congestionCharge: CongestionChargeDetails[]
): Promise<ParcelsTableRow[]> => {
    const parcelTableRows: ParcelsTableRow[] = [];

    if (processingData.length !== congestionCharge.length) {
        const logId = await logErrorReturnLogId(
            `Error with processing parcels table data. Invalid inputs, got length ${processingData.length} and ${congestionCharge.length}`
        );
        throw new Error(
            `Invalid inputs, got length ${processingData.length} and ${congestionCharge.length}. Error ID: ${logId}`
        );
    }

    for (let index = 0; index < processingData.length; index++) {
        const parcel = processingData[index];

        parcelTableRows.push({
            parcelId: parcel.parcel_id ?? "",
            clientId: parcel.client_id ?? "",
            fullName: parcel.client_full_name ?? "",
            familyCategory: familyCountToFamilyCategory(parcel.family_count ?? 0),
            addressPostcode: parcel.client_address_postcode ?? "",
            phoneNumber: parcel.client_phone_number ?? "",
            deliveryCollection: {
                collectionCentreName: parcel.collection_centre_name ?? "-",
                collectionCentreAcronym: parcel.collection_centre_acronym ?? "-",
                congestionChargeApplies: congestionCharge[index].congestionCharge,
            },
            collectionDatetime: parcel.collection_datetime
                ? new Date(parcel.collection_datetime)
                : null,
            packingSlot: parcel.packing_slot_name,
            lastStatus: processLastStatus(parcel),
            voucherNumber: parcel.voucher_number,
            packingDate: parcel.packing_date ? new Date(parcel.packing_date) : null,
            iconsColumn: {
                flaggedForAttention: parcel.client_flagged_for_attention ?? false,
                requiresFollowUpPhoneCall: parcel.client_signposting_call_required ?? false,
            },
            createdAt: parcel.created_at ? new Date(parcel.created_at) : null,
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

export const processLastStatus = (
    event:
        | Pick<
              ViewSchema["parcels_plus"],
              | "last_status_event_name"
              | "last_status_timestamp"
              | "last_status_event_data"
              | "last_status_workflow_order"
          >
        | undefined
        | null
): ParcelsTableRow["lastStatus"] => {
    if (!(event?.last_status_event_name && event.last_status_timestamp)) {
        return null;
    }

    return {
        name: event.last_status_event_name,
        eventData: event.last_status_event_data ?? "",
        timestamp: new Date(event.last_status_timestamp),
        workflowOrder: event.last_status_workflow_order ?? -1, //for now
    };
};
