"use client";

import React, { useState } from "react";
import {
    Errors,
    FormErrors,
    setError,
    setField,
    checkErrorOnSubmit,
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
import { insertParcel } from "@/app/parcels/add/databaseFunctions";
import Button from "@mui/material/Button";
import Title from "@/components/Title/Title";
import { CollectionCentresLabelsAndValues } from "@/app/parcels/add/[clientId]/page";
import { Schema } from "@/databaseUtils";

interface ParcelFields {
    voucherNumber: string;
    packingDate: Date | null;
    timeOfDay: Date | null;
    shippingMethod: string | null;
    collectionDate: Date | null;
    collectionTime: Date | null;
    collectionCentre: string | null;
}

interface ParcelFormProps {
    clientId: string;
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

const initialFields: ParcelFields = {
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

const mergeDateAndTime = (date: Date, time: Date): Date => {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
    );
};

// TODO VFB-43:
// The Add/Edit Client Form takes { initialFields, initialFormErrors, editMode, clientID }
// The Parcel Form could take { initialFields, initialFormErrors, clientId, editMode, parcelId } - where
// clientId is ignored if editMode is true.
// The param deliveryPrimaryKey will need to remain until VFB-55 is done.
// I'm not sure why collectionCentresLabelsAndValues is fetched in the page rather than the form; the
// form can make DB calls and it seems cleaner to do it here.

const ParcelForm: React.FC<ParcelFormProps> = ({
    clientId,
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
            client_id: clientId,
            packing_datetime: packingDateTime.toISOString(),
            voucher_number: fields.voucherNumber,
            collection_centre: isDelivery ? deliveryPrimaryKey : fields.collectionCentre,
            collection_datetime: collectionDateTime,
        };
        try {
            await insertParcel(formToAdd);
            router.push("/clients/");
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
