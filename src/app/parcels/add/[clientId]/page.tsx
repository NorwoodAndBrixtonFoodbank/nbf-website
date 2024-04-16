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
    getCollectionCentresInfo,
} from "@/common/fetch";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import { getLocalSupabaseClient } from "../../../../../supabase/tools/getLocalSupabaseClient";

interface AddParcelParameters {
    params: {
        clientId: string;
    };
}

const getErrorMessage = (error: FetchCollectionCentresError | PackingSlotsError): string => {
    let errorMessage = "";
    switch (error.type) {
        case "collectionCentresFetchFailed":
            errorMessage = "Failed to fetch collection centres data.";
            break;
        case "packingSlotsFetchFailed":
            errorMessage = "Failed to fetch packing slots data.";
            break;
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

const AddParcels = ({ params }: AddParcelParameters): React.ReactElement => {
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
            const supabase = getLocalSupabaseClient();

            const { data: collectionCentresData, error: collectionCentresError } =
                await getCollectionCentresInfo(supabase);
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
        <main>
            {isLoading ? (
                <></>
            ) : error ? (
                <ErrorSecondaryText>{getErrorMessage(error)}</ErrorSecondaryText>
            ) : (
                <ParcelForm
                    initialFields={initialParcelFields}
                    initialFormErrors={initialParcelFormErrors}
                    clientId={params.clientId}
                    editMode={false}
                    deliveryPrimaryKey={deliveryPrimaryKey!}
                    collectionCentresLabelsAndValues={collectionCentresLabelsAndValues!}
                    packingSlotsLabelsAndValues={packingSlotsLabelsAndValues!}
                />
            )}
        </main>
    );
};

export default AddParcels;
