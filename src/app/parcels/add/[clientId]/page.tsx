import { Metadata } from "next";
import React from "react";
import ParcelForm from "@/app/parcels/form/ParcelForm";
import { Schema } from "@/databaseUtils";
import supabase from "@/supabaseServer";
import { DatabaseError } from "@/app/errorClasses";

interface AddParcelParameters {
    params: {
        clientId: string;
    };
}

export type CollectionCentresLabelsAndValues = [
    string,
    Schema["collection_centres"]["primary_key"]
][];

type CollectionCentresInfo = [
    Schema["collection_centres"]["primary_key"],
    CollectionCentresLabelsAndValues
];

const getCollectionCentresInfo = async (): Promise<CollectionCentresInfo> => {
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

const AddParcels = async ({ params }: AddParcelParameters): Promise<React.ReactElement> => {
    const [deliveryPrimaryKey, collectionCentresLabelsAndValues] = await getCollectionCentresInfo();

    return (
        <main>
            <ParcelForm
                clientId={params.clientId}
                deliveryPrimaryKey={deliveryPrimaryKey}
                collectionCentresLabelsAndValues={collectionCentresLabelsAndValues}
            />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Add Parcels",
};

export default AddParcels;
