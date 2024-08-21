import {
    BatchClient,
    BatchDataRow,
    BatchParcel,
    BatchTableDataState,
    CollectionInfo,
} from "@/app/parcels/batch/BatchTypes";
import {
    addClientResult,
    ClientDatabaseInsertRecord,
    FamilyDatabaseInsertRecord,
    getFamilyMembers,
} from "@/app/clients/form/submitFormHelpers";
import { EXTRA_INFORMATION_LABEL, NAPPY_SIZE_LABEL } from "@/app/clients/form/labels";
import { checkboxGroupToArray } from "@/components/Form/formFunctions";
import supabase from "@/supabaseClient";
import { AuditLog, sendAuditLog } from "@/server/auditLog";
import { logErrorReturnLogId } from "@/logger/logger";
import {
    insertParcel,
    InsertParcelReturnType,
    ParcelDatabaseInsertRecord,
} from "@/app/parcels/form/submitFormHelpers";
import { mergeDateAndTime } from "@/app/parcels/form/ParcelForm";
import { ListType } from "@/common/fetch";
import { PostgrestError } from "@supabase/supabase-js";
import { defaultTableState } from "./BatchParcelDataGrid";

const batchClientToClientRecord = (client: BatchClient): ClientDatabaseInsertRecord => {
    const extraInformationWithNappy =
        client.nappySize === ""
            ? client.extraInformation
            : `${NAPPY_SIZE_LABEL}${client.nappySize}, ${EXTRA_INFORMATION_LABEL}${client.extraInformation}`;

    return {
        full_name: client.fullName,
        phone_number: client.phoneNumber,
        address_1: client.address.addressLine1,
        address_2: client.address.addressLine2,
        address_town: client.address.addressTown,
        address_county: client.address.addressCounty,
        address_postcode: client.address.addressPostcode,
        default_list: client.listType,
        dietary_requirements: checkboxGroupToArray(client.dietaryRequirements),
        feminine_products: checkboxGroupToArray(client.feminineProducts),
        baby_food: client.babyProducts,
        pet_food: checkboxGroupToArray(client.petFood),
        other_items: checkboxGroupToArray(client.otherItems),
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
    const clientRecord: ClientDatabaseInsertRecord = batchClientToClientRecord(client);
    const familyMembers: FamilyDatabaseInsertRecord[] = getFamilyMembers(
        client.adultInfo.adults,
        client.childrenInfo.children
    );

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
    parcel: BatchParcel,
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

export type AddBatchError = { rowId: number; error: { type: string; logId: string } };

export const resetBatchTableData = (
    tableState: BatchTableDataState,
    errors: AddBatchError[]
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

const submitBatchTableData = async (tableState: BatchTableDataState): Promise<AddBatchError[]> => {
    const errors: AddBatchError[] = [];

    for (const dataRow of tableState.batchDataRows) {
        if (!dataRow.data) {
            continue;
        }

        const { client, parcel } = dataRow.data;
        const rowId: number = dataRow.id;

        const { clientId, error: clientError } = dataRow.clientId
            ? { clientId: dataRow.clientId, error: null }
            : await submitClientRowToDb(client, rowId);

        if (clientError) {
            errors.push({ rowId, error: clientError });
            continue;
        }

        const listType = client.listType;

        if (!parcel) {
            continue;
        }

        const parcelRecord: ParcelDatabaseInsertRecord = batchParcelToParcelRecord(
            parcel,
            clientId,
            listType
        );
        const { error: parcelError } = await submitParcelRowToDb(parcelRecord);

        if (parcelError) {
            errors.push({ rowId, error: parcelError });
        }
    }

    return errors;
};

export default submitBatchTableData;
