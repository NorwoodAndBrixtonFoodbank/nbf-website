import { InsertSchema, UpdateSchema } from "@/databaseUtils";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
    checkboxGroupToArray,
    Fields,
    NumberAdultsByGender,
    Person,
} from "@/components/Form/formFunctions";
import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { logErrorReturnLogId } from "@/logger/logger";
import { ClientFields } from "./ClientForm";

type FamilyDatabaseInsertRecord = Omit<InsertSchema["families"], "family_id">;
type ClientDatabaseInsertRecord = InsertSchema["clients"];
type ClientDatabaseUpdateRecord = UpdateSchema["clients"];

const personToFamilyRecordWithoutFamilyId = (person: Person): FamilyDatabaseInsertRecord => {
    return {
        gender: person.gender,
        age: person.age ?? null,
    };
};

const getFamilyMembers = (
    adults: NumberAdultsByGender,
    children: Person[]
): FamilyDatabaseInsertRecord[] => {
    const peopleToInsert: Person[] = [];

    for (const child of children) {
        peopleToInsert.push(child);
    }

    for (let index = 0; index < adults.numberFemales; index++) {
        peopleToInsert.push({ gender: "female", age: undefined });
    }
    for (let index = 0; index < adults.numberMales; index++) {
        peopleToInsert.push({ gender: "male", age: undefined });
    }
    for (let index = 0; index < adults.numberUnknownGender; index++) {
        peopleToInsert.push({ gender: "other", age: undefined });
    }

    return peopleToInsert.map((person) => personToFamilyRecordWithoutFamilyId(person));
};

const formatClientRecord = (
    fields: Fields
): ClientDatabaseInsertRecord | ClientDatabaseUpdateRecord => {
    const extraInformationWithNappy =
        fields.nappySize === ""
            ? fields.extraInformation
            : `Nappy Size: ${fields.nappySize}, Extra Information: ${fields.extraInformation}`;

    return {
        full_name: fields.fullName,
        phone_number: fields.phoneNumber,
        address_1: fields.addressLine1,
        address_2: fields.addressLine2,
        address_town: fields.addressTown,
        address_county: fields.addressCounty,
        address_postcode: fields.addressPostcode,
        dietary_requirements: checkboxGroupToArray(fields.dietaryRequirements),
        feminine_products: checkboxGroupToArray(fields.feminineProducts),
        baby_food: fields.babyProducts,
        pet_food: checkboxGroupToArray(fields.petFood),
        other_items: checkboxGroupToArray(fields.otherItems),
        delivery_instructions: fields.deliveryInstructions,
        extra_information: extraInformationWithNappy,
        signposting_call_required: fields.signpostingCall,
        flagged_for_attention: fields.attentionFlag,
    };
};

export const submitAddClientForm = async (
    fields: ClientFields,
    router: AppRouterInstance
): Promise<void> => {
    const clientRecord = formatClientRecord(fields);
    const familyMembers = getFamilyMembers(fields.adults, fields.children);
    try {
        const { data: clientId, error } = await supabase.rpc("insertClientAndTheirFamily", {
            clientrecord: clientRecord,
            familymembers: familyMembers,
        });
        if (error) {
            console.log(error);
            const logId = await logErrorReturnLogId(
                "Error with inserting new client and their family",
                {
                    error,
                }
            );

            throw new DatabaseError("insert", "client", logId);
        }
        router.push(`/parcels/add/${clientId}`);
    } catch (error) {
        const logId = await logErrorReturnLogId(
            "Error with inserting new client and their family",
            {
                error,
            }
        );
        throw new DatabaseError("insert", "client", logId);
    }
};

export const submitEditClientForm = async (
    fields: ClientFields,
    router: AppRouterInstance,
    primaryKey: string
): Promise<void> => {
    const clientRecord = formatClientRecord(fields);
    const familyMembers = getFamilyMembers(fields.adults, fields.children);
    try {
        const { data: clientId, error } = await supabase.rpc("updateClientAndTheirFamily", {
            clientrecord: clientRecord,
            familymembers: familyMembers,
            clientid: primaryKey,
        });
        if (error) {
            console.log(error);
            const logId = await logErrorReturnLogId(
                `Error with updating client and their family: Client id ${primaryKey}`,
                {
                    error,
                }
            );

            throw new DatabaseError("update", "client", logId);
        }
        router.push(`/parcels/add/${clientId}`);
    } catch (error) {
        const logId = await logErrorReturnLogId(
            `Error with updating client and their family: Client id ${primaryKey}`,
            {
                error,
            }
        );
        throw new DatabaseError("update", "client", logId);
    }
};
