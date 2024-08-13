import { BooleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { BatchGridDisplayRow } from "@/app/parcels/batch/BatchParcelDataGrid";
import {
    CollectionInfo,
    OverrideDataRow,
    BatchDataRow,
    BatchTableDataState,
    Address,
} from "@/app/parcels/batch/BatchTypes";

const getEmptyRow = (id: number): BatchGridDisplayRow => {
    return {
        id: id,
        fullName: "",
        phoneNumber: "",
        address: "",
        adults: null,
        children: null,
        listType: "",
        dietaryRequirements: "",
        feminineProducts: "",
        babyProducts: "",
        petFood: "",
        otherItems: "",
        deliveryInstructions: "",
        extraInformation: "",
        attentionFlag: "",
        signpostingCall: "",
        notes: "",
        voucherNumber: "",
        packingDate: "",
        packingSlot: "",
        shippingMethod: "",
        collectionInfo: "",
    };
};

export const addressToString = (address: Address | null): string | null => {
    if (!address) {
        return null;
    }
    const addressArray: string[] = [];
    for (const key in address) {
        if (address[key] !== null) {
            addressArray.push(address[key]);
        }
    }
    return addressArray.join(", ");
};

const collectionInfoToString = (collectionInfo: CollectionInfo): string => {
    const { collectionDate, collectionSlot, collectionCentreId } = collectionInfo;
    return `${collectionDate}, ${collectionSlot}, ${collectionCentreId}`;
};

const booleanGroupToString = (booleanGroup: BooleanGroup): string => {
    const trueKeys: string[] = Object.keys(booleanGroup).filter((key) => booleanGroup[key]);
    return trueKeys.join(", ");
};

const overrideDataToOverrideDisplayRow = (dataRow: OverrideDataRow): BatchGridDisplayRow => {
    if (!dataRow.data) {
        return getEmptyRow(0);
    }
    const {
        phoneNumber,
        address,
        adultInfo,
        childrenInfo,
        listType,
        dietaryRequirements,
        feminineProducts,
        babyProducts,
        nappySize,
        petFood,
        otherItems,
        deliveryInstructions,
        extraInformation,
        attentionFlag,
        signpostingCall,
        notes,
    } = dataRow.data.client;
    const { voucherNumber, packingDate, packingSlot, shippingMethod, collectionInfo } =
        dataRow.data.parcel;
    return {
        id: 0,
        fullName: "",
        phoneNumber: phoneNumber ?? "",
        address: addressToString(address) ?? "",
        adults: adultInfo ? adultInfo.numberOfAdults : null,
        children: childrenInfo ? childrenInfo.numberOfChildren : null,
        listType: listType ?? "",
        dietaryRequirements: dietaryRequirements ? booleanGroupToString(dietaryRequirements) : "",
        feminineProducts: feminineProducts ? booleanGroupToString(feminineProducts) : "",
        babyProducts: babyProducts
            ? `Yes, Nappy Size: ${nappySize}`
            : babyProducts === false
              ? "No"
              : "",
        petFood: petFood ? booleanGroupToString(petFood) : "",
        otherItems: otherItems ? booleanGroupToString(otherItems) : "",
        deliveryInstructions: deliveryInstructions ?? "",
        extraInformation: extraInformation ?? "",
        attentionFlag: attentionFlag ? "Yes" : attentionFlag === false ? "No" : "",
        signpostingCall: signpostingCall ? "Yes" : signpostingCall === false ? "No" : "",
        notes: notes ?? "",
        voucherNumber: voucherNumber ?? "",
        packingDate: packingDate ?? "",
        packingSlot: packingSlot ?? "",
        shippingMethod: shippingMethod ?? "",
        collectionInfo: collectionInfo ? collectionInfoToString(collectionInfo) : "",
    };
};

const batchDataToBatchDisplayRow = (dataRow: BatchDataRow): BatchGridDisplayRow | null => {
    if (!dataRow.data) {
        return getEmptyRow(dataRow.id);
    }
    const {
        fullName,
        phoneNumber,
        address,
        adultInfo,
        childrenInfo,
        listType,
        dietaryRequirements,
        feminineProducts,
        babyProducts,
        nappySize,
        petFood,
        otherItems,
        deliveryInstructions,
        extraInformation,
        attentionFlag,
        signpostingCall,
        notes,
    } = dataRow.data.client;
    const {
        voucherNumber = "",
        packingDate = "",
        packingSlot = "",
        shippingMethod = "",
        collectionInfo = "",
    } = dataRow.data.parcel || {};

    return {
        id: dataRow.id,
        fullName: fullName ?? "",
        phoneNumber: phoneNumber ?? "",
        address: addressToString(address) ?? "",
        adults: adultInfo ? adultInfo.numberOfAdults : null,
        children: childrenInfo ? childrenInfo.numberOfChildren : null,
        listType: listType ?? "",
        dietaryRequirements: dietaryRequirements ? booleanGroupToString(dietaryRequirements) : "",
        feminineProducts: feminineProducts ? booleanGroupToString(feminineProducts) : "",
        babyProducts: babyProducts
            ? `Yes, Nappy Size: ${nappySize}`
            : babyProducts === false
              ? "No"
              : "",
        petFood: petFood ? booleanGroupToString(petFood) : "",
        otherItems: otherItems ? booleanGroupToString(otherItems) : "",
        deliveryInstructions: deliveryInstructions ?? "",
        extraInformation: extraInformation ?? "",
        attentionFlag: attentionFlag ? "Yes" : attentionFlag === false ? "No" : "",
        signpostingCall: signpostingCall ? "Yes" : signpostingCall === false ? "No" : "",
        notes: notes ?? "",
        voucherNumber: voucherNumber ?? "",
        packingDate: packingDate ?? "",
        packingSlot: packingSlot ?? "",
        shippingMethod: shippingMethod ?? "",
        collectionInfo: collectionInfo ? collectionInfoToString(collectionInfo) : "",
    };
};

export const tableStateToBatchDisplayRows = (
    tableState: BatchTableDataState
): BatchGridDisplayRow[] => {
    const displayRows: BatchGridDisplayRow[] = [];
    displayRows.push(overrideDataToOverrideDisplayRow(tableState.overrideDataRow));
    tableState.batchDataRows.forEach((row) => {
        const displayRow = batchDataToBatchDisplayRow(row);
        if (displayRow) {
            displayRows.push(displayRow);
        }
    });
    return displayRows;
};
