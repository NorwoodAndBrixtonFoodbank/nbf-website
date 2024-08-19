import { BatchClient, BatchDataRow, BatchTableDataState } from "./BatchTypes";
import { addClientResult, ClientDatabaseInsertRecord, FamilyDatabaseInsertRecord, getFamilyMembers, submitAddClientForm } from "@/app/clients/form/submitFormHelpers";
import { EXTRA_INFORMATION_LABEL, NAPPY_SIZE_LABEL } from "@/app/clients/form/labels";
import { checkboxGroupToArray } from "@/components/Form/formFunctions";
import supabase from "@/supabaseClient";
import { AuditLog, sendAuditLog } from "@/server/auditLog";
import { logErrorReturnLogId } from "@/logger/logger";

const batchClientToClientRecord= (clientState:BatchClient) : ClientDatabaseInsertRecord => {
    const extraInformationWithNappy =
        clientState.nappySize === ""
            ? clientState.extraInformation
            : `${NAPPY_SIZE_LABEL}${clientState.nappySize}, ${EXTRA_INFORMATION_LABEL}${clientState.extraInformation}`;

    return {
        full_name: clientState.fullName,
        phone_number: clientState.phoneNumber,
        address_1: clientState.address.addressLine1,
        address_2: clientState.address.addressLine2,
        address_town: clientState.address.addressTown,
        address_county: clientState.address.addressCounty,
        address_postcode: clientState.address.addressPostcode,
        default_list: clientState.listType,
        dietary_requirements: checkboxGroupToArray(clientState.dietaryRequirements),
        feminine_products: checkboxGroupToArray(clientState.feminineProducts),
        baby_food: clientState.babyProducts,
        pet_food: checkboxGroupToArray(clientState.petFood),
        other_items: checkboxGroupToArray(clientState.otherItems),
        delivery_instructions: clientState.deliveryInstructions,
        extra_information: extraInformationWithNappy,
        signposting_call_required: clientState.signpostingCall,
        flagged_for_attention: clientState.attentionFlag,
        // last_updated: undefined,
        notes: clientState.notes,
    };
}

const batchClientToInsertRecords = (client: BatchClient): { clientRecord: ClientDatabaseInsertRecord; familyMembers: FamilyDatabaseInsertRecord[] } => {
    const clientRecord: ClientDatabaseInsertRecord = batchClientToClientRecord(client);
    const familyMembers: FamilyDatabaseInsertRecord[] = getFamilyMembers(client.adultInfo.adults, client.childrenInfo.children);

    return { clientRecord, familyMembers };
};

const submitClientTableData = async (tableState: BatchTableDataState) : Promise<string[]> => {
    const clientIds : string[] = [];
    const errorRowIds: number[] = [];    

    tableState.batchDataRows.forEach(async (dataRow) => {
        if (!dataRow.data) {
            throw new Error("Data row is missing data");
        }

        const client = dataRow.data.client;
        const rowId = dataRow.id;

        try {
            const { clientRecord, familyMembers } = batchClientToInsertRecords(client);

            const { data: clientId, error } = await supabase.rpc("insert_client_and_family", {
                clientrecord: clientRecord,
                familymembers: familyMembers,
            });

            const auditLog = {
                action: "add a client",
                content: {
                    clientDetails: clientRecord,
                    familyMembers: familyMembers,
                },
            } as const satisfies Partial<AuditLog>;

            if (error) {
                const logId = await logErrorReturnLogId(
                    "Error with inserting new client and their family",
                    {
                        error,
                    }
                );
                await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
            } else {
                await sendAuditLog({
                    ...auditLog,
                    wasSuccess: true,
                    clientId: clientId,
                });
                clientIds.push(clientId);
            }
        } catch (error) {
            console.error(`Error processing row ${rowId}:`, error);
            errorRowIds.push(rowId);
        }
    })

    return clientIds;
};

//

export default submitClientTableData;
