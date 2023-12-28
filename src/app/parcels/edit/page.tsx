import { Metadata } from "next";

import React from "react";
import supabase from "@/supabaseServer";
import ParcelForm, { ParcelFields } from "../form/ParcelForm";
import { Errors, FormErrors } from "@/components/Form/formFunctions";
import { ParcelWithCollectionCentre, fetchParcel } from "@/common/fetch";
import { getCollectionCentresInfo } from "../add/databaseFunctions";

interface EditParcelsParameters {
    params: { id: string };
}

const prepareParcelDataForForm = (
    parcelData: ParcelWithCollectionCentre,
    deliveryPrimaryKey: string
): ParcelFields => {
    return {
        clientId: parcelData.client_id,
        voucherNumber: parcelData.voucher_number,
        packingDate: parcelData.packing_datetime ? new Date(parcelData.packing_datetime) : null,
        timeOfDay: parcelData.packing_datetime ? new Date(parcelData.packing_datetime) : null,
        shippingMethod:
            parcelData.collection_centre?.primary_key == deliveryPrimaryKey
                ? "Collection"
                : "Delivery",
        collectionDate: parcelData.collection_datetime
            ? new Date(parcelData.collection_datetime)
            : null,
        collectionTime: parcelData.collection_datetime
            ? new Date(parcelData.collection_datetime)
            : null,
        collectionCentre: parcelData.collection_centre?.primary_key ?? null,
    };
};

const EditParcels: ({ params }: EditParcelsParameters) => Promise<React.ReactElement> = async ({
    params,
}: EditParcelsParameters) => {
    const [deliveryPrimaryKey, collectionCentresLabelsAndValues] = await getCollectionCentresInfo();

    const parcelData = await fetchParcel(params.id, supabase);
    const initialFormFields = prepareParcelDataForForm(parcelData, deliveryPrimaryKey);

    const initialFormErrors: FormErrors = {
        voucherNumber: Errors.none,
        packingDate: Errors.none,
        timeOfDay: Errors.none,
        shippingMethod: Errors.none,
        collectionDate: Errors.none,
        collectionTime: Errors.none,
        collectionCentre: Errors.none,
    };

    return (
        <main>
            <ParcelForm
                initialFields={initialFormFields}
                initialFormErrors={initialFormErrors}
                editMode={true}
                parcelId={params.id}
                deliveryPrimaryKey={deliveryPrimaryKey}
                collectionCentresLabelsAndValues={collectionCentresLabelsAndValues}
            />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Edit Parcels",
};

export default EditParcels;
