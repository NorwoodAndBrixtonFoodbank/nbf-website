import { DatabaseError } from "@/app/errorClasses";
import { Schema } from "@/databaseUtils";
import { Supabase } from "@/supabaseUtils";
import { v4 as uuidv4 } from "uuid";
import { logError, logWarning } from "@/logger/logger";

type CollectionCentre = {
    collection_centre: {
        name: Schema["collection_centres"]["name"];
        acronym: Schema["collection_centres"]["acronym"];
        primary_key: Schema["collection_centres"]["primary_key"];
    } | null;
};

export type ParcelWithCollectionCentre = Omit<Schema["parcels"], "collection_centre"> &
    CollectionCentre;

export const fetchParcel = async (
    parcelID: string,
    supabase: Supabase
): Promise<ParcelWithCollectionCentre> => {
    const { data, error } = await supabase
        .from("parcels")
        .select(
            `*, 
            collection_centre:collection_centres ( 
                name,
                acronym,
                primary_key
            )`
        )
        .eq("primary_key", parcelID);
    if (error) {
        const id = uuidv4();
        const meta = {
            error: error,
            id: id,
            location: "common/fetch.ts",
        };
        void logError("Error with fetch: Parcel", meta);
        throw new DatabaseError("fetch", "parcel data");
    }
    if (data.length !== 1) {
        const errorMessage = `${
            data.length === 0 ? "No" : "Multiple"
        } records match this parcel ID.`;
        void logWarning(`${errorMessage} ${parcelID}`);
        throw new Error(errorMessage);
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
    var { data, error } = await supabase.from("collection_centres").select("primary_key, name");

    if (error) {
        const id = uuidv4();
        const meta = {
            error: error,
            id: id,
            location: "common/fetch.ts",
        };
        void logError("Error with fetch: Collection centres data", meta);
        throw new DatabaseError("fetch", "collection centre data");
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
        const id = uuidv4();
        const meta = {
            error: error,
            id: id,
            location: "common/fetch.ts",
        };
        void logError("Error with fetch: Client data", meta);
        throw new DatabaseError("fetch", "client data");
    }
    if (data.length !== 1) {
        const errorMessage = `${
            data.length === 0 ? "No" : "Multiple"
        } records match this client ID.`;
        throw new Error(errorMessage);
    }
    return data[0];
};

export const fetchFamily = async (
    familyID: string,
    supabase: Supabase
): Promise<Schema["families"][]> => {
    const { data, error } = await supabase.from("families").select().eq("family_id", familyID);
    if (error) {
        const id = uuidv4();
        const meta = {
            error: error,
            id: id,
            location: "common/fetch.ts",
        };
        void logError("Error with fetch: Family data", meta);
        throw new DatabaseError("fetch", "family data");
    }
    return data;
};

export const fetchLists = async (supabase: Supabase): Promise<Schema["lists"][]> => {
    const { data, error } = await supabase.from("lists").select().order("row_order");
    if (error) {
        const id = uuidv4();
        const meta = {
            error: error,
            id: id,
            location: "common/fetch.ts",
        };
        void logError("Error with fetch: Lists data", meta);
        throw new DatabaseError("fetch", "lists data");
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
        const id = uuidv4();
        const meta = {
            error: error,
            id: id,
            location: "common/fetch.ts",
        };
        void logError("Error with fetch: Lists comment", meta);
        throw new DatabaseError("fetch", "lists comment");
    }

    return data.value;
};
