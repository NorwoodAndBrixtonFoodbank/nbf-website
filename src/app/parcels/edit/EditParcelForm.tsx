"use client";

import React, { useEffect, useState } from "react";
import ParcelForm, { initialParcelFields, ParcelErrors, ParcelFields } from "../form/ParcelForm";
import {
    CollectionCentresLabelsAndValues,
    fetchClient,
    FetchClientError,
    FetchCollectionCentresError,
    fetchPackingSlotsInfo,
    fetchParcel,
    FetchParcelError,
    getActiveCollectionCentres,
    ListTypeLabelsAndValues,
    PackingSlotsError,
    PackingSlotsLabelsAndValues,
    ParcelWithCollectionCentreAndPackingSlot,
} from "@/common/fetch";
import supabase from "@/supabaseClient";
import { Errors } from "@/components/Form/formFunctions";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import Title from "@/components/Title/Title";
import { updateParcel } from "@/app/parcels/form/submitFormHelpers";
import { formatDatetimeAsTime } from "@/common/format";

interface EditParcelFormProps {
    parcelId: string;
}

const prepareParcelDataForForm = (
    parcelData: ParcelWithCollectionCentreAndPackingSlot,
    deliveryPrimaryKey: string
): ParcelFields => {
    return {
        clientId: parcelData.client_id,
        listType: parcelData.list_type,
        voucherNumber: parcelData.voucher_number,
        packingDate: parcelData.packing_date,
        packingSlot: parcelData.packing_slot?.primary_key,
        shippingMethod:
            parcelData.collection_centre?.primary_key == deliveryPrimaryKey
                ? "Delivery"
                : "Collection",
        collectionDate: parcelData.collection_datetime,
        collectionSlot: formatDatetimeAsTime(parcelData.collection_datetime),
        collectionCentre: parcelData.collection_centre?.primary_key ?? null,
        lastUpdated: parcelData.last_updated,
    };
};

const getErrorMessage = (
    error: FetchCollectionCentresError | PackingSlotsError | FetchParcelError | FetchClientError
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
        case "clientFetchFailed":
            errorMessage = "Unable to fetch client data. Please refresh the page.";
            break;
        case "noMatchingClients":
            errorMessage = "No matching clients with client ID. Please refresh the page.";
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
    const [listTypeLabelsAndValues, setListTypeLabelsAndValues] = useState<ListTypeLabelsAndValues>(
        []
    );
    const [packingSlots, setPackingSlots] = useState<PackingSlotsLabelsAndValues>([]);
    const [packingSlotIsShown, setPackingSlotsIsShown] = useState<boolean | undefined>(true);
    const [collectionCentreIsShown, setCollectionCentreIsShown] = useState<boolean>(true);
    const [error, setError] = useState<
        FetchCollectionCentresError | PackingSlotsError | FetchParcelError | FetchClientError | null
    >(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data: collectionCentresData, error: collectionCentresError } =
                await getActiveCollectionCentres(supabase);
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
            setCollectionCentreIsShown(parcelData.collection_centre?.is_shown === true);

            if (!initialFormFields.clientId) {
                setListTypeLabelsAndValues([
                    ["Regular", "regular"],
                    ["Hotel", "hotel"],
                ]);
            } else {
                const { data: clientData, error: clientError } = await fetchClient(
                    initialFormFields.clientId,
                    supabase
                );
                if (clientError) {
                    setError(clientError);
                    setIsLoading(false);
                    return;
                }
                setListTypeLabelsAndValues(
                    clientData.default_list === "regular"
                        ? [
                              ["Regular (default)", "regular"],
                              ["Hotel", "hotel"],
                          ]
                        : [
                              ["Regular", "regular"],
                              ["Hotel (default)", "hotel"],
                          ]
                );
            }

            setIsLoading(false);
        })();
        
    }, [parcelId]);

    const initialFormErrors: ParcelErrors = {
        listType: Errors.none,
        voucherNumber: Errors.none,
        packingDate: Errors.none,
        packingSlot: packingSlotIsShown ? Errors.none : Errors.invalidPackingSlot,
        shippingMethod: Errors.none,
        collectionDate: Errors.none,
        collectionSlot: Errors.none,
        collectionCentre: collectionCentreIsShown ? Errors.none : Errors.invalidCollectionCentre,
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
                    writeParcelInfoToDatabase={updateParcel(parcelId)}
                    deliveryPrimaryKey={deliveryKey}
                    collectionCentresLabelsAndValues={collectionCentres}
                    packingSlotsLabelsAndValues={packingSlots}
                    listTypeLabelsAndValues={listTypeLabelsAndValues}
                />
            )}
        </>
    );
};

export default EditParcelForm;
