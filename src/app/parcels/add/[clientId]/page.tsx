import { Metadata } from "next";
import React from "react";
import ParcelForm, {
    initialParcelFields,
    initialParcelFormErrors,
} from "@/app/parcels/form/ParcelForm";
import supabase from "@/supabaseServer";
import { getCollectionCentresInfo } from "@/common/fetch";

interface AddParcelParameters {
    params: {
        clientId: string;
    };
}

const AddParcels = async ({ params }: AddParcelParameters): Promise<React.ReactElement> => {
    const [deliveryPrimaryKey, collectionCentresLabelsAndValues] = await getCollectionCentresInfo(
        supabase
    );

    return (
        <main>
            <ParcelForm
                initialFields={initialParcelFields}
                initialFormErrors={initialParcelFormErrors}
                clientId={params.clientId}
                editMode={false}
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
