import { Metadata } from "next";
import React from "react";
import ParcelForm, { ParcelFields } from "@/app/parcels/form/ParcelForm";
import { Errors, FormErrors } from "@/components/Form/formFunctions";
import { getCollectionCentresInfo } from "../databaseFunctions";

interface AddParcelParameters {
    params: {
        clientId: string;
    };
}

const initialFields: ParcelFields = {
    clientId: null,
    voucherNumber: "",
    packingDate: null,
    timeOfDay: null,
    shippingMethod: "",
    collectionDate: null,
    collectionTime: null,
    collectionCentre: null,
};

const initialFormErrors: FormErrors = {
    voucherNumber: Errors.none,
    packingDate: Errors.initial,
    timeOfDay: Errors.initial,
    shippingMethod: Errors.initial,
    collectionDate: Errors.initial,
    collectionTime: Errors.initial,
    collectionCentre: Errors.initial,
};

const AddParcels = async ({ params }: AddParcelParameters): Promise<React.ReactElement> => {
    const [deliveryPrimaryKey, collectionCentresLabelsAndValues] = await getCollectionCentresInfo();

    return (
        <main>
            <ParcelForm
                initialFields={initialFields}
                initialFormErrors={initialFormErrors}
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
