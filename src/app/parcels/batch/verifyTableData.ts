import { logErrorReturnLogId } from "@/logger/logger";
import { BatchClient, ParcelData, BatchTableDataState } from "@/app/parcels/batch/batchTypes";
import { AddBatchRowError } from "@/app/parcels/batch/submitTableData";

const checkRequiredClientDataIsNotEmpty = (client: BatchClient): boolean => {
    const hasRequiredFields: boolean =
        client.fullName !== null &&
        client.address !== null &&
        client.adultInfo !== null &&
        client.listType !== null &&
        client.babyProducts !== null &&
        client.deliveryInstructions !== null &&
        client.extraInformation !== null &&
        client.attentionFlag !== null &&
        client.signpostingCall !== null &&
        client.attentionFlag !== null;

    return hasRequiredFields;
};

const checkRequiredParcelDataIsNotEmpty = (parcel: ParcelData): boolean => {
    const hasRequiredFields: boolean =
        parcel.packingDate !== null &&
        parcel.packingSlot !== null &&
        parcel.shippingMethod !== null;

    const validCollectionOrDelivery: boolean =
        parcel.shippingMethod !== "Collection" ||
        (parcel.shippingMethod === "Collection" && parcel.collectionInfo !== null);

    return hasRequiredFields && validCollectionOrDelivery;
};

export const checkParcelDataIsNotEmpty = (parcel: ParcelData): boolean => {
    return Object.values(parcel).every((value) => value == null);
};

export const verifyBatchTableData = async (
    tableState: BatchTableDataState
): Promise<AddBatchRowError[]> => {
    const confirmationErrors: AddBatchRowError[] = [];

    for (const dataRow of tableState.batchDataRows) {
        const { client, parcel } = dataRow.data;
        const rowId: number = dataRow.id;

        if (!checkRequiredClientDataIsNotEmpty(client)) {
            const logId = await logErrorReturnLogId("Client has missing data");
            confirmationErrors.push({
                rowId,
                error: {
                    type: "missingRequiredClientData",
                    logId: logId,
                },
                displayMessage: "Missing Required Client Data",
            });
            continue;
        }

        if (checkParcelDataIsNotEmpty(parcel)) {
            continue;
        }

        if (!checkRequiredParcelDataIsNotEmpty(parcel)) {
            const logId = await logErrorReturnLogId("Parcel has missing data");
            confirmationErrors.push({
                rowId,
                error: {
                    type: "missingRequiredParcelData",
                    logId: logId,
                },
                displayMessage: "Missing Required Parcel Data",
            });
            continue;
        }
    }
    return confirmationErrors;
};
