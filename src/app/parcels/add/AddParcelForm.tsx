"use client";

import React, { useEffect, useState } from "react";
import ParcelForm, {
    initialParcelFields,
    initialParcelFormErrors,
} from "@/app/parcels/form/ParcelForm";
import {
    CollectionCentresLabelsAndValues,
    FetchCollectionCentresError,
    PackingSlotsError,
    PackingSlotsLabelsAndValues,
    fetchPackingSlotsInfo,
    getActiveCollectionCentres,
} from "@/common/fetch";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import supabase from "@/supabaseClient";
import Title from "@/components/Title/Title";
import { insertParcel } from "@/app/parcels/form/submitFormHelpers";

interface AddParcelProps {
    clientId: string;
}

const getErrorMessage = (error: FetchCollectionCentresError | PackingSlotsError): string => {
    let errorMessage: string;
    switch (error.type) {
        case "collectionCentresFetchFailed":
            errorMessage = "Failed to fetch collection centres data. Please refresh the page.";
            break;
        case "packingSlotsFetchFailed":
            errorMessage = "Failed to fetch packing slots data. Please refresh the page.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const AddParcels = ({ clientId }: AddParcelProps): React.ReactElement => {
    const [deliveryPrimaryKey, setDeliveryPrimaryKey] = useState<string | null>(null);
    const [collectionCentresLabelsAndValues, setCollectionCentresLabelsAndValues] =
        useState<CollectionCentresLabelsAndValues | null>(null);
    const [packingSlotsLabelsAndValues, setPackingSlotsLabelsAndValues] =
        useState<PackingSlotsLabelsAndValues | null>(null);
    const [error, setError] = useState<FetchCollectionCentresError | PackingSlotsError | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);

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
            setCollectionCentresLabelsAndValues(
                collectionCentresData.collectionCentresLabelsAndValues
            );
            setDeliveryPrimaryKey(collectionCentresData.deliveryPrimaryKey);

            const { data: packingSlotsData, error: packingSlotsError } =
                await fetchPackingSlotsInfo(supabase);
            if (packingSlotsError) {
                setError(packingSlotsError);
                setIsLoading(false);
                return;
            }
            setPackingSlotsLabelsAndValues(packingSlotsData);
            setIsLoading(false);
        })();
    }, []);

    return (
        <>
            <Title>Add Parcel</Title>
            {isLoading ? (
                <></>
            ) : error ? (
                <ErrorSecondaryText>{getErrorMessage(error)}</ErrorSecondaryText>
            ) : (
                deliveryPrimaryKey &&
                collectionCentresLabelsAndValues &&
                packingSlotsLabelsAndValues && (
                    <ParcelForm
                        initialFields={initialParcelFields}
                        initialFormErrors={initialParcelFormErrors}
                        clientId={clientId}
                        writeParcelInfoToDatabase={insertParcel}
                        deliveryPrimaryKey={deliveryPrimaryKey}
                        collectionCentresLabelsAndValues={collectionCentresLabelsAndValues}
                        packingSlotsLabelsAndValues={packingSlotsLabelsAndValues}
                    />
                )
            )}
        </>
    );
};

export default AddParcels;
