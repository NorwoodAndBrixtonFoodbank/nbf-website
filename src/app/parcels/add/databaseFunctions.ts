import supabase from "@/supabaseClient";
import { InsertSchema, Schema, UpdateSchema } from "@/databaseUtils";
import { DatabaseError } from "@/app/errorClasses";

export type CollectionCentresLabelsAndValues = [
    string,
    Schema["collection_centres"]["primary_key"]
][];

type CollectionCentresInfo = [
    Schema["collection_centres"]["primary_key"],
    CollectionCentresLabelsAndValues
];

export const getCollectionCentresInfo = async (): Promise<CollectionCentresInfo> => {
    const { data, error } = await supabase.from("collection_centres").select("primary_key, name");

    if (error) {
        throw new DatabaseError("fetch", "collection centre data");
    }
    const collectionCentresLabelsAndValues: CollectionCentresLabelsAndValues = data
        .filter((collectionCentre) => collectionCentre.name !== "Delivery")
        .map((collectionCentre) => [collectionCentre.name, collectionCentre.primary_key]);

    const deliveryPrimaryKey = data.filter(
        (collectionCentre) => collectionCentre.name === "Delivery"
    )[0].primary_key;

    return [deliveryPrimaryKey, collectionCentresLabelsAndValues];
};

type ParcelDatabaseInsertRecord = InsertSchema["parcels"];
type ParcelDatabaseUpdateRecord = UpdateSchema["parcels"];
type ParcelAndClientIds = Pick<Schema["parcels"], "primary_key" | "client_id">;

export const insertParcel = async (
    parcelRecord: ParcelDatabaseInsertRecord
): Promise<ParcelAndClientIds> => {
    const {
        data: ids,
        status,
        error,
    } = await supabase.from("parcels").insert(parcelRecord).select("primary_key, client_id");

    if (error === null && Math.floor(status / 100) === 2) {
        return ids![0];
    }
    throw new DatabaseError("insert", "parcel data");
};

export const updateParcel = async (
    parcelRecord: ParcelDatabaseUpdateRecord,
    primaryKey: string
): Promise<ParcelAndClientIds> => {
    const {
        data: ids,
        status,
        error,
    } = await supabase
        .from("parcels")
        .update(parcelRecord)
        .eq("primary_key", primaryKey)
        .select("primary_key, client_id");

    if (error === null && Math.floor(status / 100) === 2) {
        return ids![0];
    }
    throw new DatabaseError("update", "parcel data");
};
