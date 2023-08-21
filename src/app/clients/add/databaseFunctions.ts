import supabase from "@/supabaseClient";
import { InsertSchema, Schema } from "@/database_utils";
import { Person } from "@/components/Form/formFunctions";

type FamilyDatabaseInsertRecord = InsertSchema["families"];
export type ClientDatabaseInsertRecord = InsertSchema["clients"];
type ClientDatabaseFetchRecord = Pick<Schema["clients"], "primary_key" | "family_id">;

export const insertFamily = async (peopleArray: Person[], familyID: string): Promise<void> => {
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
        throw new Error("We could not process the request at this time. Please try again later.");
    }
};

export const insertClient = async (
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
    throw new Error("We could not process the request at this time. Please try again later.");
};

export const deleteFailedInsert = async (primary_key: string): Promise<void> => {
    await supabase.from("clients").delete().eq("primary_key", primary_key);
};
