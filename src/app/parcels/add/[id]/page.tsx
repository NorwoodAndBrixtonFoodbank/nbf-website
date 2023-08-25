import { Metadata } from "next";
import React from "react";
import AddParcelForm from "@/app/parcels/add/AddParcelForm";
import { Schema } from "@/database_utils";
import supabase from "@/supabaseServer";

interface AddParcelParameters {
    params: {
        id: string;
    };
}

export type CollectionCentresLabelsAndValues = [
    string,
    Schema["collection_centres"]["primary_key"]
][];

const getCollectionCentresLabelsAndValues = async (): Promise<CollectionCentresLabelsAndValues> => {
    const { data, error } = await supabase.from("collection_centres").select("primary_key, name");

    if (error) {
        throw new Error(
            "We were unable to fetch the collection centre data. Please try again later"
        );
    }

    return data
        .filter((collectionCentre) => collectionCentre.name !== "Delivery")
        .map((collectionCentre) => [collectionCentre.name, collectionCentre.primary_key]);
};

const AddParcels = async ({ params }: AddParcelParameters): Promise<React.ReactElement> => {
    const collectionCentresLabelsAndValues = await getCollectionCentresLabelsAndValues();

    return (
        <main>
            <AddParcelForm
                id={params.id}
                collectionCentresLabelsAndValues={collectionCentresLabelsAndValues}
            />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Add Parcels",
};

export default AddParcels;
