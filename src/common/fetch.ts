import { DatabaseError } from "@/app/errorClasses";
import { Schema } from "@/databaseUtils";
import { Supabase } from "@/supabaseUtils";
import { logErrorReturnLogId, logWarningReturnLogId } from "@/logger/logger";
import { PostgrestError } from "@supabase/supabase-js";

type CollectionCentre = {
    name: Schema["collection_centres"]["name"];
    acronym: Schema["collection_centres"]["acronym"];
    primary_key: Schema["collection_centres"]["primary_key"];
};

type PackingSlot = {
    name: Schema["packing_slots"]["name"];
    primary_key: Schema["packing_slots"]["primary_key"];
    is_shown: Schema["packing_slots"]["is_shown"];
};

type DatabaseProfile = {
    role: Schema["profiles"]["role"];
    first_name: Schema["profiles"]["first_name"];
    last_name: Schema["profiles"]["last_name"];
    telephone_number: Schema["profiles"]["telephone_number"];
};

type UserProfileDataAndError =
    | {
          data: DatabaseProfile;
          error: null;
      }
    | {
          data: null;
          error: PostgrestError;
      };

export interface ParcelWithCollectionCentreAndPackingSlot {
    client_id: string;
    collection_centre: CollectionCentre | null;
    collection_datetime: string | null;
    packing_date: string | null;
    packing_slot: PackingSlot | null;
    primary_key: string;
    voucher_number: string | null;
}

export const fetchParcel = async (
    parcelID: string,
    supabase: Supabase
): Promise<ParcelWithCollectionCentreAndPackingSlot> => {
    const { data, error } = await supabase
        .from("parcels")
        .select(
            `*, 
            collection_centre:collection_centres ( 
                name,
                acronym,
                primary_key
            ),
            packing_slot: packing_slots (
                name,
                primary_key,
                is_shown
            )`
        )
        .eq("primary_key", parcelID);
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Parcel", error);
        throw new DatabaseError("fetch", "parcel data", logId);
    }
    if (data.length !== 1) {
        const errorMessage = `${
            data.length === 0 ? "No" : "Multiple"
        } records match this parcel ID.`;
        const logId = await logWarningReturnLogId(`${errorMessage} ${parcelID}`);
        throw new Error(errorMessage + `Log ID: ${logId}`);
    }
    return data[0];
};

export type CollectionCentresLabelsAndValues = [
    string,
    Schema["collection_centres"]["primary_key"],
][];

type CollectionCentresInfo = [
    Schema["collection_centres"]["primary_key"],
    CollectionCentresLabelsAndValues,
];

export const getCollectionCentresInfo = async (
    supabase: Supabase
): Promise<CollectionCentresInfo> => {
    const { data, error } = await supabase.from("collection_centres").select("primary_key, name");

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Collection centres data", error);
        throw new DatabaseError("fetch", "collection centre data", logId);
    }

    const collectionCentresLabelsAndValues: CollectionCentresLabelsAndValues = data!
        .filter((collectionCentre) => collectionCentre.name !== "Delivery")
        .map((collectionCentre) => [collectionCentre.name, collectionCentre.primary_key]);

    const deliveryPrimaryKey = data!.filter(
        (collectionCentre) => collectionCentre.name === "Delivery"
    )[0].primary_key;

    return [deliveryPrimaryKey, collectionCentresLabelsAndValues];
};

export const fetchClient = async (
    primaryKey: string,
    supabase: Supabase
): Promise<Schema["clients"]> => {
    const { data, error } = await supabase.from("clients").select().eq("primary_key", primaryKey);
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Client data", error);
        throw new DatabaseError("fetch", "client data", logId);
    }
    if (data.length !== 1) {
        const errorMessage = `${
            data.length === 0 ? "No" : "Multiple"
        } records match this client ID.`;

        const logId = await logErrorReturnLogId(
            "Error with client ID" + `${errorMessage} ${primaryKey}`
        );
        throw new Error(errorMessage + `Log ID: ${logId}`);
    }
    return data[0];
};

export const fetchFamily = async (
    familyID: string,
    supabase: Supabase
): Promise<Schema["families"][]> => {
    const { data, error } = await supabase.from("families").select().eq("family_id", familyID);
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Family data", error);
        throw new DatabaseError("fetch", "family data", logId);
    }
    return data;
};

export const fetchLists = async (supabase: Supabase): Promise<Schema["lists"][]> => {
    const { data, error } = await supabase.from("lists").select().order("row_order");
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Lists data", error);
        throw new DatabaseError("fetch", "lists data", logId);
    }
    return data;
};

export const fetchComment = async (supabase: Supabase): Promise<string> => {
    const { data, error } = await supabase
        .from("website_data")
        .select()
        .eq("name", "lists_text")
        .limit(1)
        .single();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Lists comment", error);
        throw new DatabaseError("fetch", "lists comment", logId);
    }

    return data.value;
};

export type PackingSlotsLabelsAndValues = [string, Schema["packing_slots"]["primary_key"]][];

export const fetchPackingSlotsInfo = async (
    supabase: Supabase
): Promise<PackingSlotsLabelsAndValues> => {
    const { data, error } = await supabase
        .from("packing_slots")
        .select("primary_key, name")
        .order("order")
        .eq("is_shown", true);

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Packing slots data", error);
        throw new DatabaseError("fetch", "packing slots data", logId);
    }

    const packingSlotsLabelsAndValues: PackingSlotsLabelsAndValues = data.map((packingSlot) => [
        packingSlot.name,
        packingSlot.primary_key,
    ]);

    return packingSlotsLabelsAndValues;
};

export const fetchUserProfile = async (
    userId: string,
    supabase: Supabase
): Promise<UserProfileDataAndError> => {
    const { data, error } = await supabase
        .from("profiles")
        .select("role, first_name, last_name, telephone_number")
        .eq("primary_key", userId)
        .single();

    if (error) {
        void logErrorReturnLogId("Failed to fetch: user profile", error);
        return { data: null, error: error };
    }

    return { data: data, error: null };
};
