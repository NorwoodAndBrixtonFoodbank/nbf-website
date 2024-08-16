import { Schema } from "@/databaseUtils";
import { BatchClient, BatchDataRow, BatchTableDataState } from "./BatchTypes";
import { addClientResult, ClientDatabaseInsertRecord, ClientDatabaseUpdateRecord, FamilyDatabaseInsertRecord, formatClientRecord, getFamilyMembers, submitAddClientForm } from "@/app/clients/form/submitFormHelpers";
import { ClientFields } from "@/app/clients/form/ClientForm";
import supabase from "@/supabaseClient";
import { useRouter } from "next/navigation";

const batchClientToClientFields = (clientState:BatchClient) : ClientFields => {
    return {
        fullName: clientState.fullName,
        phoneNumber: clientState.phoneNumber,
        addressLine1: clientState.address.addressLine1,
        addressLine2: clientState.address.addressLine2 ?? "",
        addressTown: clientState.address.addressTown,
        addressCounty: clientState.address.addressCounty ?? "",
        addressPostcode: clientState.address.addressPostcode,
        adults: clientState.adultInfo.adults,
        numberOfAdults: clientState.adultInfo.numberOfAdults,
        children: clientState.childrenInfo.children,
        numberOfChildren: clientState.childrenInfo.numberOfChildren,
        listType: clientState.listType,
        dietaryRequirements: clientState.dietaryRequirements,
        feminineProducts: clientState.feminineProducts,
        babyProducts: clientState.babyProducts,
        nappySize: clientState.nappySize ?? "",
        petFood: clientState.petFood,
        otherItems: clientState.otherItems,
        deliveryInstructions: clientState.deliveryInstructions ?? "",
        extraInformation: "",
        attentionFlag: clientState.attentionFlag,
        signpostingCall: clientState.signpostingCall,
        lastUpdated: undefined,
        notes: clientState.notes,
    }

}

const batchClientToSchemas = async (client: BatchClient) : Promise<{clientRecord: ClientDatabaseInsertRecord, familyMembers: FamilyDatabaseInsertRecord[]}> => {
    const clientRecord : ClientDatabaseInsertRecord | ClientDatabaseUpdateRecord= formatClientRecord(batchClientToClientFields(client));
    const familyMembers : FamilyDatabaseInsertRecord[] = getFamilyMembers(client.adultInfo.adults, client.childrenInfo.children);

    const { data: clientId, error } = await supabase.rpc("insert_client_and_family", {
        clientrecord: clientRecord,
        familymembers: familyMembers,
    });

    return {clientRecord, familyMembers};
}

const submitTableData = async (tableState: BatchTableDataState) : Promise<addClientResult> => {
    tableState.batchDataRows.forEach(async (dataRow) => {
        if (!dataRow.data) {    
            throw new Error("Data row is missing data");
        }
        
        const {client, parcel} = dataRow.data;
        const { clientId, error: addClientError } = await submitAddClientForm(batchClientToClientFields(client));
        console.log("Row:",dataRow.id)




        // if(client){
        //     const {clientRecord, familyMembers} = batchClientToSchemas(client);
            

        // }
        // if(parcel){

    })
};

// 

export default submitTableData;