"use client";

import React, { useState } from "react";
import {
    Errors,
    FormErrors,
    setError,
    setField,
    checkErrorOnSubmit,
    Fields,
} from "@/components/Form/formFunctions";
import { CenterComponent, StyledForm, FormErrorText } from "@/components/Form/formStyling";

import { useRouter } from "next/navigation";

import VoucherNumberCard from "@/app/parcels/form/formSections/VoucherNumberCard";
import PackingDateCard from "@/app/parcels/form/formSections/PackingDateCard";
import TimeOfDayCard from "@/app/parcels/form/formSections/TimeofDayCard";
import ShippingMethodCard from "@/app/parcels/form/formSections/ShippingMethodCard";
import CollectionDateCard from "@/app/parcels/form/formSections/CollectionDateCard";
import CollectionTimeCard from "@/app/parcels/form/formSections/CollectionTimeCard";
import CollectionCentreCard from "@/app/parcels/form/formSections/CollectionCentreCard";
import {
    CollectionCentresLabelsAndValues,
    insertParcel,
    updateParcel,
} from "@/app/parcels/add/databaseFunctions";
import Button from "@mui/material/Button";
import Title from "@/components/Title/Title";
import { Schema } from "@/databaseUtils";

export interface ParcelFields extends Fields {
    clientId: string | null;
    voucherNumber: string | null;
    packingDate: Date | null;
    timeOfDay: Date | null;
    shippingMethod: string | null;
    collectionDate: Date | null;
    collectionTime: Date | null;
    collectionCentre: string | null;
}

interface ParcelFormProps {
    initialFields: ParcelFields;
    initialFormErrors: FormErrors;
    clientId?: string;
    editMode: boolean;
    parcelId?: string;
    deliveryPrimaryKey: Schema["collection_centres"]["primary_key"];
    collectionCentresLabelsAndValues: CollectionCentresLabelsAndValues;
}

const withCollectionFormSections = [
    VoucherNumberCard,
    PackingDateCard,
    TimeOfDayCard,
    ShippingMethodCard,
    CollectionDateCard,
    CollectionTimeCard,
    CollectionCentreCard,
];

const noCollectionFormSections = [
    VoucherNumberCard,
    PackingDateCard,
    TimeOfDayCard,
    ShippingMethodCard,
];

const mergeDateAndTime = (date: Date, time: Date): Date => {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
    );
};

// TODO VFB-55:
// The param deliveryPrimaryKey will need to remain until VFB-55 is done.

const ParcelForm: React.FC<ParcelFormProps> = ({
    initialFields,
    initialFormErrors,
    clientId,
    editMode,
    parcelId,
    deliveryPrimaryKey,
    collectionCentresLabelsAndValues,
}) => {
    const router = useRouter();
    const [fields, setFields] = useState(initialFields);
    const [formErrors, setFormErrors] = useState(initialFormErrors);
    const [submitError, setSubmitError] = useState(Errors.none);
    const [submitErrorMessage, setSubmitErrorMessage] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const formSections =
        fields.shippingMethod === "Collection"
            ? withCollectionFormSections
            : noCollectionFormSections;

    const fieldSetter = setField(setFields, fields);
    const errorSetter = setError(setFormErrors, formErrors);

    const submitForm = async (): Promise<void> => {
        setSubmitErrorMessage("");
        setSubmitDisabled(true);
        let inputError;
        if (fields.shippingMethod === "Collection") {
            inputError = checkErrorOnSubmit(formErrors, setFormErrors);
        } else {
            inputError = checkErrorOnSubmit(formErrors, setFormErrors, [
                "voucherNumber",
                "packingDate",
                "timeOfDay",
                "shippingMethod",
            ]);
        }
        if (inputError) {
            setSubmitError(Errors.submit);
            setSubmitDisabled(false);
            return;
        }

        const packingDateTime = mergeDateAndTime(
            new Date(fields.packingDate!),
            new Date(fields.timeOfDay!)
        );

        let collectionDateTime = null;
        if (fields.shippingMethod === "Collection") {
            collectionDateTime = mergeDateAndTime(
                new Date(fields.collectionDate!),
                new Date(fields.collectionTime!)
            ).toISOString();
        }

        const isDelivery = fields.shippingMethod === "Delivery";

        const formToAdd = {
            client_id: (clientId || fields.clientId)!,
            packing_datetime: packingDateTime.toISOString(),
            voucher_number: fields.voucherNumber,
            collection_centre: isDelivery ? deliveryPrimaryKey : fields.collectionCentre,
            collection_datetime: collectionDateTime,
        };

        try {
            if (editMode) {
                await updateParcel(formToAdd, parcelId!);
            } else {
                await insertParcel(formToAdd);
            }
            router.push("/parcels/");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSubmitError(Errors.external);
                setSubmitErrorMessage(error.message);
            }
        }
        setSubmitDisabled(false);
    };

    return (
        <CenterComponent>
            <StyledForm>
                <Title>Add Parcel</Title>
                {formSections.map((Card, index) => {
                    return (
                        <Card
                            key={index}
                            formErrors={formErrors}
                            errorSetter={errorSetter}
                            fieldSetter={fieldSetter}
                            fields={fields}
                            collectionCentresLabelsAndValues={collectionCentresLabelsAndValues}
                        />
                    );
                })}
                <CenterComponent>
                    <Button variant="contained" onClick={submitForm} disabled={submitDisabled}>
                        Submit
                    </Button>
                </CenterComponent>
                <FormErrorText>{submitErrorMessage || submitError}</FormErrorText>
            </StyledForm>
        </CenterComponent>
    );
};

export default ParcelForm;
