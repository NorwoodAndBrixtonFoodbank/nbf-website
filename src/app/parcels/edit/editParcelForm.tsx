"use client";

import React, { useEffect, useState } from "react";
import ParcelForm, { ParcelFields, initialParcelFields } from "../form/ParcelForm";
import {
    CollectionCentresLabelsAndValues,
    ParcelWithCollectionCentre,
    fetchParcel,
    getCollectionCentresInfo,
} from "@/common/fetch";
import supabase from "@/supabaseClient";
import { Errors, FormErrors } from "@/components/Form/formFunctions";

interface EditParcelFormProps {
    parcelId: string;
}

const prepareParcelDataForForm = (
    parcelData: ParcelWithCollectionCentre,
    deliveryPrimaryKey: string
): ParcelFields => {
    return {
        clientId: parcelData.client_id,
        voucherNumber: parcelData.voucher_number,
        packingDate: parcelData.packing_datetime,
        packingTime: parcelData.packing_datetime,
        shippingMethod:
            parcelData.collection_centre?.primary_key == deliveryPrimaryKey
                ? "Delivery"
                : "Collection",
        collectionDate: parcelData.collection_datetime,
        collectionTime: parcelData.collection_datetime,
        collectionCentre: parcelData.collection_centre?.primary_key ?? null,
    };
};

const EditParcelForm = ({ parcelId }: EditParcelFormProps): React.ReactElement => {
    const [isLoading, setIsLoading] = useState(true);
    const [initialFormFields, setInitialFormFields] = useState<ParcelFields>(initialParcelFields);
    const [deliveryKey, setDeliveryKey] = useState("");
    const [collectionCentres, setCollectionCentres] = useState<CollectionCentresLabelsAndValues>(
        []
    );

    useEffect(() => {
        (async () => {
            const [deliveryPrimaryKey, collectionCentresLabelsAndValues] =
                await getCollectionCentresInfo(supabase);
            const parcelData = await fetchParcel(parcelId, supabase);

            setInitialFormFields(prepareParcelDataForForm(parcelData, deliveryPrimaryKey));
            setDeliveryKey(deliveryPrimaryKey);
            setCollectionCentres(collectionCentresLabelsAndValues);
            setIsLoading(false);
        })();
    }, [parcelId]);

    const initialFormErrors: FormErrors = {
        voucherNumber: Errors.none,
        packingDate: Errors.none,
        packingTime: Errors.none,
        shippingMethod: Errors.none,
        collectionDate: Errors.none,
        collectionTime: Errors.none,
        collectionCentre: Errors.none,
    };

    return isLoading ? (
        <></>
    ) : (
        <ParcelForm
            initialFields={initialFormFields}
            initialFormErrors={initialFormErrors}
            editMode={true}
            parcelId={parcelId}
            deliveryPrimaryKey={deliveryKey}
            collectionCentresLabelsAndValues={collectionCentres}
        />
    );
};

export default EditParcelForm;
