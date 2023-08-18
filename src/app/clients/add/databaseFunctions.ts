import { checkboxGroupToArray, Fields, Person } from "@/components/Form/formFunctions";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { InsertSchema, Schema, UpdateSchema } from "@/database_utils";
import supabase from "@/supabaseServer";

type FamilyDatabaseInsertRecord = InsertSchema["families"];
type FamilyDatabaseUpdateRecord = UpdateSchema["families"];

export type SubmitFormHelper = (
    fields: Fields,
    router: AppRouterInstance,
    primaryKey?: string
) => void;
export type ClientDatabaseInsertRecord = InsertSchema["clients"];
export type ClientDatabaseUpdateRecord = UpdateSchema["clients"];
type ClientDatabaseFetchRecord = Pick<Schema["clients"], "primary_key" | "family_id">;

const insertFamily = async (peopleArray: Person[], familyID: string): Promise<void> => {
    const familyRecords: FamilyDatabaseInsertRecord[] = [];

    for (const person of peopleArray) {
        if (person.quantity === undefined || person.quantity > 0) {
            const newFamilyRecord: FamilyDatabaseInsertRecord[] = Array(person.quantity ?? 1).fill({
                family_id: familyID,
                gender: person.gender,
                age: person.age ?? null,
            });
            familyRecords.push(...newFamilyRecord);
        }
    }

    const { status, error } = await supabase.from("families").insert(familyRecords);

    if (error !== null || Math.floor(status / 100) !== 2) {
        throw Error(
            `Error occurred whilst inserting into Families table. HTTP Code: ${status}, PostgreSQL Code: ${error?.code}. `
        );
    }
};

const insertClient = async (
    clientRecord: ClientDatabaseInsertRecord
): Promise<ClientDatabaseFetchRecord> => {
    const {
        data: ids,
        status,
        error,
    } = await supabase.from("clients").insert(clientRecord).select("primary_key, family_id");

    if (error === null && Math.floor(status / 100) === 2) {
        return ids![0];
    }
    throw Error(
        `Error occurred whilst inserting into Clients table. HTTP Code: ${status}, PostgreSQL Code: ${error?.code}. `
    );
};

const deleteFailedInsert = async (primaryKey: string): Promise<void> => {
    await supabase.from("clients").delete().eq("primary_key", primaryKey);
};

const updateClient = async (
    clientRecord: ClientDatabaseUpdateRecord,
    primaryKey: string
): Promise<ClientDatabaseFetchRecord> => {
    const {
        data: ids,
        status,
        error,
    } = await supabase
        .from("clients")
        .update(clientRecord)
        .eq("primary_key", primaryKey)
        .select("primary_key, family_id");

    if (error === null && Math.floor(status / 100) === 2) {
        return ids![0];
    }
    throw Error(
        `Error occurred whilst updating into Clients table. HTTP Code: ${status}, PostgreSQL Code: ${error?.code}. `
    );
};

const updateChild = async (child: Person): Promise<void> => {
    const childRecord: FamilyDatabaseUpdateRecord = {
        gender: child.gender,
        age: child.age,
    };
    const { status, error } = await supabase
        .from("families")
        .update(childRecord)
        .eq("primary_key", child.primaryKey);

    if (error !== null || Math.floor(status / 100) !== 2) {
        throw Error(
            `Error occurred whilst updating the Families table. HTTP Code: ${status}, PostgreSQL Code: ${error?.code}. `
        );
    }
};

const countAdultMember = async (familyID: string, gender: string): Promise<number> => {
    const { count, error } = await supabase
        .from("families")
        .select("*", { count: "exact", head: true })
        .eq("family_id", familyID)
        .eq("gender", gender)
        .is("age", null);

    if (error !== null || count === null) {
        throw error;
    }
    return count;
};

const deleteAdultMembers = async (
    familyID: string,
    gender: string,
    count: number
): Promise<void> => {
    const { status, error } = await supabase
        .from("families")
        .delete()
        .eq("family_id", familyID)
        .eq("gender", gender)
        .is("age", null)
        .limit(count);

    if (error !== null || Math.floor(status / 100) !== 2) {
        throw Error(
            `Error occurred whilst updating the Families table. HTTP Code: ${status}, PostgreSQL Code: ${error?.code}. `
        );
    }
};

const updateFamily = async (
    adults: Person[],
    children: Person[],
    familyID: string
): Promise<void> => {
    for (const adultGroup of adults) {
        const numberAdultsInDatabase = await countAdultMember(familyID, adultGroup.gender);
        const difference = adultGroup.quantity! - numberAdultsInDatabase;
        if (difference > 0) {
            const arrayToInsert: Person[] = [{ ...adultGroup, quantity: difference }];
            await insertFamily(arrayToInsert, familyID);
        }
        if (difference < 0) {
            await deleteAdultMembers(familyID, adultGroup.gender, difference);
        }
    }

    children.forEach(updateChild);
};

const revertFailedUpdate = async (initialRecords: ClientDatabaseUpdateRecord): Promise<void> => {
    await supabase
        .from("clients")
        .update(initialRecords)
        .eq("primary_key", initialRecords.primary_key);
};

export const submitFormAddClients: SubmitFormHelper = async (fields, router) => {
    const extraInformationWithNappy =
        fields.nappySize === ""
            ? fields.extraInformation
            : `Nappy Size: ${fields.nappySize}, Extra Information: ${fields.extraInformation}`;

    const clientRecord: ClientDatabaseInsertRecord = {
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

    const ids = await insertClient(clientRecord);
    try {
        await insertFamily([...fields.adults, ...fields.children], ids.family_id);
        router.push(`/parcels/add/${ids.primary_key}`);
    } catch (error) {
        await deleteFailedInsert(ids.primary_key);
        throw error;
    }
};

const fetchClients = async (primaryKey: string): Promise<Schema["clients"]> => {
    const { data, error } = await supabase.from("clients").select().eq("primary_key", primaryKey);
    if (error !== null) {
        throw Error(`${error.code}: ${error.message}`);
    }
    if (data.length !== 1) {
        const errorMessage =
            (data.length === 0 ? "No " : "Multiple ") + "records match this client ID.";
        throw Error(errorMessage);
    }
    return data[0];
};

export const submitFormEditClients: SubmitFormHelper = async (fields, router, primaryKey) => {
    const extraInformationWithNappy =
        fields.nappySize === ""
            ? fields.extraInformation
            : `Nappy Size: ${fields.nappySize}, Extra Information: ${fields.extraInformation}`;

    const clientRecord: ClientDatabaseUpdateRecord = {
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

    const clientBeforeUpdate = await fetchClients(primaryKey!);
    const ids = await updateClient(clientRecord, primaryKey!);
    try {
        await updateFamily(fields.adults, fields.children, ids.family_id);
        router.push(`/parcels/add/${ids.primary_key}`);
    } catch (error) {
        await revertFailedUpdate(clientBeforeUpdate);
        throw error;
    }
};
