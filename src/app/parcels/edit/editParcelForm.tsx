"use client";

import React, { useEffect, useState } from "react";
import ParcelForm, { ParcelFields, initialParcelFields } from "../form/ParcelForm";
import {
    CollectionCentresLabelsAndValues,
    fetchParcel,
    getCollectionCentresInfo,
    PackingSlotsLabelsAndValues,
    fetchPackingSlotsInfo,
    ParcelWithCollectionCentreAndPackingSlot,
} from "@/common/fetch";
import supabase from "@/supabaseClient";
import { Errors, FormErrors } from "@/components/Form/formFunctions";

interface EditParcelFormProps {
    parcelId: string;
}

const prepareParcelDataForForm = (
    parcelData: ParcelWithCollectionCentreAndPackingSlot,
    deliveryPrimaryKey: string
): ParcelFields => {
    return {
        clientId: parcelData.client_id,
        voucherNumber: parcelData.voucher_number,
        packingDate: parcelData.packing_date,
        packingSlot: parcelData.packing_slot!.primary_key,
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
    const [packingSlots, setPackingSlots] = useState<PackingSlotsLabelsAndValues>([]);
    const [packingSlotIsShown, setPackingSlotsIsShown] = useState<boolean | undefined>(true);

    useEffect(() => {
        (async () => {
            const [deliveryPrimaryKey, collectionCentresLabelsAndValues] =
                await getCollectionCentresInfo(supabase);
            const packingSlotsLabelsAndValues = await fetchPackingSlotsInfo(supabase);
            const parcelData = await fetchParcel(parcelId, supabase);
            setInitialFormFields(prepareParcelDataForForm(parcelData, deliveryPrimaryKey));
            setDeliveryKey(deliveryPrimaryKey);
            setPackingSlots(packingSlotsLabelsAndValues);
            setCollectionCentres(collectionCentresLabelsAndValues);
            setPackingSlotsIsShown(parcelData.packing_slot?.is_shown);
            setIsLoading(false);
        })();
    }, [parcelId]);

    const initialFormErrors: FormErrors = {
        voucherNumber: Errors.none,
        packingDate: Errors.none,
        packingSlots: Errors.none,
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
            packingSlotsLabelsAndValues={packingSlots}
            packingSlotIsShown={packingSlotIsShown}
        />
    );
};

export default EditParcelForm;
