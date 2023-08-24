import { InsertSchema, Schema, UpdateSchema } from "@/database_utils";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { checkboxGroupToArray, Fields, Person } from "@/components/Form/formFunctions";
import supabase from "@/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { FetchError, RequestError } from "@/app/errorClasses";

type FamilyDatabaseInsertRecord = InsertSchema["families"];
type FamilyDatabaseUpdateRecord = UpdateSchema["families"];
type ClientDatabaseInsertRecord = InsertSchema["clients"];
type ClientDatabaseUpdateRecord = UpdateSchema["clients"];
type ClientAndFamilyIds = Pick<Schema["clients"], "primary_key" | "family_id">;

type SubmitFormHelper = (
    fields: Fields,
    router: AppRouterInstance,
    initialFields?: Fields,
    primaryKey?: string
) => void;

interface PeopleGroupedByAction {
    [key: string]: Person[];
}

const errorExists = (error: PostgrestError | null, status: number): boolean => {
    return error !== null || Math.floor(status / 100) !== 2;
};

const personToFamilyRecord = (person: Person, familyID: string): FamilyDatabaseInsertRecord[] => {
    return Array(person.quantity ?? 1).fill({
        family_id: familyID,
        gender: person.gender,
        age: person.age ?? null,
    });
};

const getChildrenInDatabase = async (familyID: string): Promise<string[]> => {
    const { data, status, error } = await supabase
        .from("families")
        .select("primary_key")
        .eq("family_id", familyID)
        .not("age", "is", null);

    if (errorExists(error, status)) {
        throw new FetchError("the children data");
    }
    return data!.map((datum) => datum.primary_key);
};

const getNumberAdults = async (familyID: string, gender: string): Promise<number> => {
    const { count, status, error } = await supabase
        .from("families")
        .select("*", { count: "exact", head: true })
        .eq("family_id", familyID)
        .eq("gender", gender)
        .is("age", null);

    if (errorExists(error, status)) {
        throw new FetchError("the number of adults data");
    }
    return count!;
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

    if (errorExists(error, status)) {
        throw new RequestError();
    }
};

const updateChildren = async (children: Person[]): Promise<void> => {
    for (const child of children) {
        const record: FamilyDatabaseUpdateRecord = {
            gender: child.gender,
            age: child.age,
        };
        const { status, error } = await supabase
            .from("families")
            .update(record)
            .eq("primary_key", child.primaryKey);

        if (errorExists(error, status)) {
            throw new RequestError();
        }
    }
};

const deleteChildren = async (children: Person[]): Promise<void> => {
    for (const child of children) {
        const { status, error } = await supabase
            .from("families")
            .delete()
            .eq("primary_key", child.primaryKey);

        if (errorExists(error, status)) {
            throw new RequestError();
        }
    }
};

const insertClient = async (
    clientRecord: ClientDatabaseInsertRecord
): Promise<ClientAndFamilyIds> => {
    const {
        data: ids,
        status,
        error,
    } = await supabase.from("clients").insert(clientRecord).select("primary_key, family_id");

    if (errorExists(error, status)) {
        throw new RequestError();
    }
    return ids![0];
};

const insertFamily = async (peopleArray: Person[], familyID: string): Promise<void> => {
    const familyRecords: FamilyDatabaseInsertRecord[] = [];

    for (const person of peopleArray) {
        if (person.quantity === undefined || person.quantity > 0) {
            familyRecords.push(...personToFamilyRecord(person, familyID));
        }
    }

    const { status, error } = await supabase.from("families").insert(familyRecords);

    if (errorExists(error, status)) {
        throw new RequestError();
    }
};

const updateClient = async (
    clientRecord: ClientDatabaseUpdateRecord,
    primaryKey: string
): Promise<ClientAndFamilyIds> => {
    const {
        data: ids,
        status,
        error,
    } = await supabase
        .from("clients")
        .update(clientRecord)
        .eq("primary_key", primaryKey)
        .select("primary_key, family_id");

    if (errorExists(error, status)) {
        throw new RequestError();
    }
    return ids![0];
};

const updateFamily = async (
    adults: Person[],
    children: Person[],
    familyID: string
): Promise<void> => {
    const childrenInDatabase = await getChildrenInDatabase(familyID);
    const people: PeopleGroupedByAction = { toInsert: [], toUpdate: [], toDelete: [] };

    for (const child of children) {
        if (child.primaryKey === undefined) {
            people.toInsert.push(child);
            continue;
        }
        if (childrenInDatabase.includes(child.primaryKey)) {
            people.toUpdate.push(child);
            continue;
        }
        people.toDelete.push(child);
    }

    for (const adult of adults) {
        const numberAdultsInDatabase = await getNumberAdults(familyID, adult.gender);
        const difference = adult.quantity! - numberAdultsInDatabase;
        if (difference > 0) {
            const record = { ...adult, quantity: difference };
            people.toInsert.push(record);
        }
        if (difference < 0) {
            await deleteAdultMembers(familyID, adult.gender, -difference);
        }
    }

    await insertFamily(people.toInsert, familyID);
    await updateChildren(people.toUpdate);
    await deleteChildren(people.toDelete);
};

const revertClientInsert = async (primaryKey: string): Promise<void> => {
    await supabase.from("clients").delete().eq("primary_key", primaryKey);
};

const revertClientUpdate = async (initialRecords: ClientDatabaseUpdateRecord): Promise<void> => {
    const { error } = await supabase
        .from("clients")
        .update(initialRecords)
        .eq("primary_key", initialRecords.primary_key);
    if (error) {
        throw new Error(
            "We could not revert an incomplete client update at this time, and there may be faulty data stored. Please contact a developer for assistance."
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
        await insertFamily([...fields.adults, ...fields.children], ids.family_id);
        router.push(`/parcels/add/${ids.primary_key}`);
    } catch (error) {
        await revertClientInsert(ids.primary_key);
        throw new RequestError();
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
        router.push(`/parcels/add/${ids.primary_key}`);
    } catch (error) {
        await revertClientUpdate(clientBeforeUpdate);
        throw new RequestError();
    }
};
