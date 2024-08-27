import {
    BatchClient,
    BatchDataRow,
    ParcelData,
    BatchTableDataState,
    CollectionInfo,
    BatchEditData,
} from "@/app/parcels/batch/batchTypes";
import {
    addClientResult,
    ClientDatabaseInsertRecord,
    FamilyDatabaseInsertRecord,
    getFamilyMembers,
} from "@/app/clients/form/submitFormHelpers";
import { EXTRA_INFORMATION_LABEL, NAPPY_SIZE_LABEL } from "@/app/clients/form/labels";
import { checkboxGroupToArray, Person } from "@/components/Form/formFunctions";
import supabase from "@/supabaseClient";
import { AuditLog, sendAuditLog } from "@/server/auditLog";
import { logErrorReturnLogId } from "@/logger/logger";
import {
    InsertParcelReturnType,
    ParcelDatabaseInsertRecord,
} from "@/app/parcels/form/submitFormHelpers";
import { mergeDateAndTime } from "@/app/parcels/form/ParcelForm";
import { ListType } from "@/common/fetch";
import { defaultTableState } from "@/app/parcels/batch/displayComponents/BatchParcelDataGrid";
import { Json } from "@/databaseTypesFile";
import { emptyBatchEditData } from "./emptyData";

const batchClientToClientRecord = (client: BatchClient): ClientDatabaseInsertRecord => {
    const extraInformationWithNappy =
        client.nappySize === ""
            ? client.extraInformation
            : `${NAPPY_SIZE_LABEL}${client.nappySize}, ${EXTRA_INFORMATION_LABEL}${client.extraInformation}`;

    return {
        full_name: client.fullName,
        phone_number: client.phoneNumber,
        address_1: client.address && client.address.addressLine1,
        address_2: client.address && client.address.addressLine2,
        address_town: client.address && client.address.addressTown,
        address_county: client.address && client.address.addressCounty,
        address_postcode: client.address && client.address.addressPostcode,
        default_list: client.listType || undefined,
        dietary_requirements:
            client.dietaryRequirements && checkboxGroupToArray(client.dietaryRequirements),
        feminine_products: client.feminineProducts && checkboxGroupToArray(client.feminineProducts),
        baby_food: client.babyProducts,
        pet_food: client.petFood && checkboxGroupToArray(client.petFood),
        other_items: client.otherItems && checkboxGroupToArray(client.otherItems),
        delivery_instructions: client.deliveryInstructions,
        extra_information: extraInformationWithNappy,
        signposting_call_required: client.signpostingCall,
        flagged_for_attention: client.attentionFlag,
        notes: client.notes,
    };
};

const batchClientToInsertRecords = (
    client: BatchClient
): { clientRecord: ClientDatabaseInsertRecord; familyMembers: FamilyDatabaseInsertRecord[] } => {
    const adults: Person[] = client.adultInfo?.adults || [];
    const children: Person[] = client.childrenInfo?.children || [];

    const clientRecord: ClientDatabaseInsertRecord = batchClientToClientRecord(client);
    const familyMembers: FamilyDatabaseInsertRecord[] = getFamilyMembers(adults, children);

    return { clientRecord, familyMembers };
};

const submitClientRowToDb = async (
    client: BatchClient,
    rowId: number
): Promise<addClientResult> => {
    const { clientRecord, familyMembers } = batchClientToInsertRecords(client);

    const { data: clientId, error } = await supabase.rpc("insert_client_and_family", {
        clientrecord: clientRecord,
        familymembers: familyMembers,
    });

    if (error) {
        const logId = await logErrorReturnLogId(
            "Error with inserting new client and their family",
            {
                error,
            }
        );
        return { clientId: null, error: { type: "failedToInsertClientAndFamily", logId } };
    }

    console.log(`Row ${rowId}: Client ${client.fullName}, ${clientId} added successfully`);

    return { clientId: clientId, error: null };
};

const batchParcelToParcelRecord = (
    parcel: ParcelData,
    clientId: string,
    listType: ListType
): ParcelDatabaseInsertRecord => {
    const collectionInfo: CollectionInfo | null = parcel.collectionInfo;

    if (collectionInfo) {
        const collectionDateTime = mergeDateAndTime(
            collectionInfo.collectionDate,
            collectionInfo.collectionSlot
        ).toISOString();

        return {
            client_id: clientId,
            collection_centre: collectionInfo.collectionCentreId,
            collection_datetime: collectionDateTime,
            list_type: listType,
            packing_date: parcel.packingDate,
            packing_slot: parcel.packingSlot,
            voucher_number: parcel.voucherNumber,
        };
    }

    return {
        client_id: clientId,
        list_type: listType,
        packing_date: parcel.packingDate,
        packing_slot: parcel.packingSlot,
        voucher_number: parcel.voucherNumber,
    };
};

const submitParcelRowToDb = async (
    parcelRecord: ParcelDatabaseInsertRecord
): Promise<InsertParcelReturnType> => {
    const { data, error } = await supabase
        .from("parcels")
        .insert(parcelRecord)
        .select("primary_key")
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with insert: parcel data", error);
        return { parcelId: null, error: { type: "failedToInsertParcel", logId } };
    }

    return { parcelId: data.primary_key, error: null };
};

const checkForRequiredClientData = (client: BatchClient): boolean => {
    const hasRequiredFields: boolean =
        client.fullName !== null &&
        client.address !== null &&
        client.adultInfo !== null &&
        client.childrenInfo !== null &&
        client.listType !== null &&
        client.babyProducts !== null &&
        client.deliveryInstructions !== null &&
        client.extraInformation !== null &&
        client.attentionFlag !== null &&
        client.signpostingCall !== null &&
        client.signpostingCall !== null &&
        client.attentionFlag !== null;

    return hasRequiredFields;
};

const checkForRequiredParcelData = (parcel: ParcelData): boolean => {
    const hasRequiredFields: boolean =
        parcel.packingDate !== null &&
        parcel.packingSlot !== null &&
        parcel.shippingMethod !== null;

    const validCollectionOrDelivery: boolean =
        parcel.shippingMethod !== "Collection" ||
        (parcel.shippingMethod === "Collection" && parcel.collectionInfo !== null);

    return hasRequiredFields && validCollectionOrDelivery;
};

const checkForEmptyParcel = (parcel: ParcelData): boolean => {
    return Object.values(parcel).every((value) => value == null);
};

const checkForEmptyRow = (data: BatchEditData): boolean => {
    return data === emptyBatchEditData;
};

export interface AddBatchRowError {
    [key: string]: Json;
    rowId: number;
    error: {
        type: string;
        logId: string;
    };
}

export const displayUnsubmittedRows = (
    tableState: BatchTableDataState,
    errors: AddBatchRowError[]
): BatchTableDataState => {
    if (errors.length === 0) {
        return defaultTableState;
    }

    const errorRowIds: number[] = errors.map((error) => error.rowId);

    const newBatchDataRows: BatchDataRow[] = tableState.batchDataRows.filter((dataRow) => {
        return errorRowIds.includes(dataRow.id);
    });

    return {
        ...tableState,
        batchDataRows: newBatchDataRows,
    };
};

export interface SubmitBatchResult {
    errors: AddBatchRowError[];
    newClientIds: string[];
    newParcelIds: string[];
}

const submitBatchTableData = async (
    tableState: BatchTableDataState
): Promise<SubmitBatchResult> => {
    const errors: AddBatchRowError[] = [];
    const newClientIds: string[] = [];
    const newParcelIds: string[] = [];

    for (const dataRow of tableState.batchDataRows) {
        const { client, parcel } = dataRow.data;
        const rowId: number = dataRow.id;

        if (checkForEmptyRow(dataRow.data)) {
            continue;
        }

        // comments will be completed in the next PR
        if (!checkForRequiredClientData(client)) {
            // const logId = await logErrorReturnLogId("Client has missing data");
            // errors.push({
            //     rowId,
            //     error: {
            //         type: "missingRequiredClientData",
            //         logId: logId,
            //     },
            // });
            continue;
        }

        const { clientId, error: clientError } = dataRow.clientId
            ? { clientId: dataRow.clientId, error: null }
            : await (async () => {
                  const result: addClientResult = await submitClientRowToDb(client, rowId);
                  result.clientId && newClientIds.push(result.clientId);
                  return result;
              })();

        if (clientError) {
            errors.push({ rowId, error: clientError });
            continue;
        }

        const listType: ListType = client.listType || "regular";

        if (checkForEmptyParcel(parcel)) {
            continue;
        }

        if (!checkForRequiredParcelData(parcel)) {
            // const logId = await logErrorReturnLogId("Parcel has missing data");
            // errors.push({
            //     rowId,
            //     error: {
            //         type: "missingRequiredParcelData",
            //         logId: logId,
            //     },
            // });
            continue;
        }

        const parcelRecord: ParcelDatabaseInsertRecord = batchParcelToParcelRecord(
            parcel,
            clientId,
            listType
        );

        const { parcelId, error: parcelError } = await submitParcelRowToDb(parcelRecord);

        if (parcelError) {
            errors.push({ rowId, error: parcelError });
            continue;
        }

        parcelId && newParcelIds.push(parcelId);
    }

    const auditLog = {
        action: "add a batch",
        content: {
            errors: errors,
            newClientIds: newClientIds,
            newParcelIds: newParcelIds,
        },
    } as const satisfies Partial<AuditLog>;

    if (errors.length > 0) {
        const logId = await logErrorReturnLogId("Error with adding a batch");
        await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
    } else {
        await sendAuditLog({ ...auditLog, wasSuccess: true });
    }

    return { errors, newClientIds, newParcelIds };
};

export default submitBatchTableData;
