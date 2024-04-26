"use client";

import React, { useEffect, useState } from "react";
import ParcelForm, { ParcelErrors, ParcelFields, initialParcelFields } from "../form/ParcelForm";
import {
    CollectionCentresLabelsAndValues,
    fetchParcel,
    getCollectionCentresInfo,
    PackingSlotsLabelsAndValues,
    fetchPackingSlotsInfo,
    ParcelWithCollectionCentreAndPackingSlot,
    FetchCollectionCentresError,
    PackingSlotsError,
    FetchParcelError,
} from "@/common/fetch";
import supabase from "@/supabaseClient";
import { Errors } from "@/components/Form/formFunctions";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import Title from "@/components/Title/Title";

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
        packingSlot: parcelData.packing_slot?.primary_key,
        shippingMethod:
            parcelData.collection_centre?.primary_key == deliveryPrimaryKey
                ? "Delivery"
                : "Collection",
        collectionDate: parcelData.collection_datetime,
        collectionTime: parcelData.collection_datetime,
        collectionCentre: parcelData.collection_centre?.primary_key ?? null,
        lastUpdated: parcelData.last_updated,
    };
};

const getErrorMessage = (
    error: FetchCollectionCentresError | PackingSlotsError | FetchParcelError
): string => {
    let errorMessage: string;
    switch (error.type) {
        case "collectionCentresFetchFailed":
            errorMessage = "Failed to fetch collection centres data.";
            break;
        case "packingSlotsFetchFailed":
            errorMessage = "Failed to fetch packing slots data.";
            break;
        case "failedToFetchParcel":
            errorMessage = "Failed to fetch parcel data.";
            break;
        case "noMatchingParcels":
            errorMessage = "No parcel in the database matches the selected parcel.";
            break;
    }
    return `${errorMessage} Log Id: ${error.logId}`;
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
    const [collectionCentreIsShown, setCollectionCentreIsShown] = useState<boolean | undefined>(
        true
    );
    const [error, setError] = useState<
        FetchCollectionCentresError | PackingSlotsError | FetchParcelError | null
    >(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data: collectionCentresData, error: collectionCentresError } =
                await getCollectionCentresInfo(supabase);
            if (collectionCentresError) {
                setError(collectionCentresError);
                setIsLoading(false);
                return;
            }
            setDeliveryKey(collectionCentresData.deliveryPrimaryKey);
            setCollectionCentres(collectionCentresData.collectionCentresLabelsAndValues);

            const { data: packingSlotsData, error: packingSlotsError } =
                await fetchPackingSlotsInfo(supabase);
            if (packingSlotsError) {
                setError(packingSlotsError);
                setIsLoading(false);
                return;
            }
            setPackingSlots(packingSlotsData);

            const { data: parcelData, error: parcelError } = await fetchParcel(parcelId, supabase);
            if (parcelError) {
                setError(parcelError);
                setIsLoading(false);
                return;
            }
            setInitialFormFields(
                prepareParcelDataForForm(parcelData, collectionCentresData.deliveryPrimaryKey)
            );
            setPackingSlotsIsShown(parcelData.packing_slot?.is_shown);
            setCollectionCentreIsShown(parcelData.collection_centre?.is_shown);

            setIsLoading(false);
        })();
    }, [parcelId]);

    const initialFormErrors: ParcelErrors = {
        voucherNumber: Errors.none,
        packingDate: Errors.none,
        packingSlot: Errors.none,
        shippingMethod: Errors.none,
        collectionDate: Errors.none,
        collectionTime: Errors.none,
        collectionCentre: Errors.none,
    };

    return (
        <>
            <Title>Edit Parcel</Title>
            {isLoading ? (
                <></>
            ) : error ? (
                <ErrorSecondaryText>{getErrorMessage(error)}</ErrorSecondaryText>
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
                    collectionCentreIsShown={collectionCentreIsShown}
                />
            )}
        </>
    );
};

export default EditParcelForm;
