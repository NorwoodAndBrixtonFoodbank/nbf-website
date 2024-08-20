import {
    BatchClient,
    BatchParcel,
    BatchTableDataState,
    CollectionInfo,
} from "@/app/parcels/batch/BatchTypes";
import {
    ClientDatabaseInsertRecord,
    FamilyDatabaseInsertRecord,
    getFamilyMembers,
} from "@/app/clients/form/submitFormHelpers";
import { EXTRA_INFORMATION_LABEL, NAPPY_SIZE_LABEL } from "@/app/clients/form/labels";
import { checkboxGroupToArray } from "@/components/Form/formFunctions";
import supabase from "@/supabaseClient";
import { AuditLog, sendAuditLog } from "@/server/auditLog";
import { logErrorReturnLogId } from "@/logger/logger";
import { insertParcel, ParcelDatabaseInsertRecord } from "@/app/parcels/form/submitFormHelpers";
import { mergeDateAndTime } from "@/app/parcels/form/ParcelForm";
import { ListType } from "@/common/fetch";

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

const submitClientRowToDb = async (client: BatchClient, rowId: number): Promise<string | null> => {
    const { clientRecord, familyMembers } = batchClientToInsertRecords(client);

    const { data: clientId, error } = await supabase.rpc("insert_client_and_family", {
        clientrecord: clientRecord,
        familymembers: familyMembers,
    });

    const auditLog = {
        action: "add client",
        content: {
            clientDetails: clientRecord,
            familyMembers: familyMembers,
        },
    } as const satisfies Partial<AuditLog>;

    if (error) {
        console.log(`Error processing row ${rowId}:`, error);
        const logId = await logErrorReturnLogId(`Error processing row ${rowId}:`, {
            error,
        });
        await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
        return null;
    }

    await sendAuditLog({
        ...auditLog,
        wasSuccess: true,
        clientId: clientId,
    });
    console.log(`Client ${clientId}, ${clientRecord.full_name} added successfully`);
    return clientId;
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

const submitBatchTableData = async (tableState: BatchTableDataState): Promise<void> => {
    for (const dataRow of tableState.batchDataRows) {
        if (!dataRow.data) {
            console.log("error data does not exist");
            continue;
        }

        const { client, parcel } = dataRow.data;
        const rowId: number = dataRow.id;

        const clientId = dataRow.clientId
            ? dataRow.clientId
            : await submitClientRowToDb(client, rowId);

        const listType = client.listType;

        if (parcel && clientId) {
            const parcelRecord = batchParcelToParcelRecord(parcel, clientId, listType);
            await insertParcel(parcelRecord);
        }
    }
};

export default submitBatchTableData;
