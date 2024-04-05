import { InsertSchema, Schema, UpdateSchema } from "@/databaseUtils";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
    checkboxGroupToArray,
    Fields,
    NumberAdultsByGender,
    Person,
} from "@/components/Form/formFunctions";
import supabase from "@/supabaseClient";
import { DatabaseError } from "@/app/errorClasses";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";

type FamilyDatabaseInsertRecord = InsertSchema["families"];
type ClientDatabaseInsertRecord = InsertSchema["clients"];
type ClientDatabaseUpdateRecord = UpdateSchema["clients"];
type ClientAndFamilyIds = Pick<Schema["clients"], "primary_key" | "family_id">;

type SubmitFormHelper = (
    fields: Fields,
    router: AppRouterInstance,
    initialFields?: Fields,
    primaryKey?: string
) => Promise<void>;

const personToFamilyRecord = (person: Person, familyID: string): FamilyDatabaseInsertRecord => {
    return {
        family_id: familyID,
        gender: person.gender,
        age: person.age ?? null,
    };
};

const clearFamily = async (familyId: string): Promise<void> => {
    const { error } = await supabase.from("families").delete().eq("family_id", familyId);

    if (error) {
        const logId = await logErrorReturnLogId(`Error with delete: Family ID ${familyId}`, {
            error,
        });
        throw new DatabaseError("delete", "person", logId);
    }
    void logInfoReturnLogId(`Family with familyID ${familyId} cleared.`);
};

const insertFamilyMembers = async (peopleArray: Person[], familyID: string): Promise<void> => {
    const familyRecords: FamilyDatabaseInsertRecord[] = [];

    for (const person of peopleArray) {
        familyRecords.push(personToFamilyRecord(person, familyID));
    }

    const { error } = await supabase.from("families").insert(familyRecords);

    if (error) {
        const logId = await logErrorReturnLogId(`Error with insert: Family ID ${familyID}`, {
            error,
        });
        throw new DatabaseError("insert", "family", logId);
    }
};

const insertClient = async (
    clientRecord: ClientDatabaseInsertRecord
): Promise<ClientAndFamilyIds> => {
    const { data: ids, error } = await supabase
        .from("clients")
        .insert(clientRecord)
        .select("primary_key, family_id");

    if (error) {
        const logId = await logErrorReturnLogId("Error with insert: Client", { error });
        throw new DatabaseError("insert", "client", logId);
    }
    void logInfoReturnLogId(`Client ${clientRecord.full_name} successfully created.`);
    return ids![0];
};

const updateClient = async (
    clientRecord: ClientDatabaseUpdateRecord,
    primaryKey: string
): Promise<ClientAndFamilyIds> => {
    const { data: ids, error } = await supabase
        .from("clients")
        .update(clientRecord)
        .eq("primary_key", primaryKey)
        .select("primary_key, family_id");

    if (error) {
        const logId = await logErrorReturnLogId(`Error with update: Client ID ${primaryKey}`, {
            error,
        });
        throw new DatabaseError("update", "client", logId);
    }
    return ids![0];
};

const updateFamily = async (
    adults: NumberAdultsByGender,
    children: Person[],
    familyId: string
): Promise<void> => {
    const peopleToInsert: Person[] = [];
    await clearFamily(familyId);

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

    await insertFamilyMembers(peopleToInsert, familyId);
};

const revertClientInsert = async (primaryKey: string): Promise<void> => {
    const { error } = await supabase.from("clients").delete().eq("primary_key", primaryKey);
    if (error) {
        const logId = await logErrorReturnLogId(
            `Error with delete: Revert incomplete client insert, Client ID ${primaryKey}`,
            { error }
        );
        throw new Error(
            "We could not revert an incomplete client insert at this time, and there may be faulty data stored. Please contact a developer for assistance." +
                `ErrorID: ${logId}`
        );
    }
};

const revertClientUpdate = async (
    initialRecords: ClientDatabaseUpdateRecord,
    primaryKey: string
): Promise<void> => {
    const { error } = await supabase
        .from("clients")
        .update(initialRecords)
        .eq("primary_key", primaryKey);
    if (error) {
        const logId = logErrorReturnLogId(
            `Error with delete: Revert incomplete client update, Client ID ${primaryKey}`,
            { error }
        );
        throw new Error(
            "We could not revert an incomplete client update at this time, and there may be faulty data stored. Please contact a developer for assistance." +
                `ErrorID: ${logId}`
        );
    }
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

export const submitAddClientForm: SubmitFormHelper = async (fields, router) => {
    const clientRecord = formatClientRecord(fields);
    const ids = await insertClient(clientRecord);
    try {
        await insertFamilyMembers([...fields.adults, ...fields.children], ids.family_id);
        router.push(`/parcels/add/${ids.primary_key}`);
    } catch (error) {
        await revertClientInsert(ids.primary_key);
        const logId = await logErrorReturnLogId(`Error with insert: Client ID ${ids.primary_key}`, {
            error,
        });
        throw new DatabaseError("update", "client", logId);
    }
};

export const submitEditClientForm: SubmitFormHelper = async (
    fields,
    router,
    initialFields,
    primaryKey
) => {
    const clientRecord = formatClientRecord(fields);
    const clientBeforeUpdate = formatClientRecord(initialFields!);
    const ids = await updateClient(clientRecord, primaryKey!);
    try {
        await updateFamily(fields.adults, fields.children, ids.family_id);
        router.push(`/clients?clientId=${primaryKey}`);
    } catch (error) {
        await revertClientUpdate(clientBeforeUpdate, primaryKey!);
        const logId = await logErrorReturnLogId(`Error with update: Client ID ${ids.primary_key}`, {
            error,
        });
        throw new DatabaseError("update", "client", logId);
    }
};
