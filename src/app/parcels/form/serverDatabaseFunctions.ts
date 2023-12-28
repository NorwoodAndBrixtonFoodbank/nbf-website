import { DatabaseError } from "@/app/errorClasses";
import { Schema } from "@/databaseUtils";
import supabase from "@/supabaseServer";

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
