"use client";

import React, { useState } from "react";
import {
    Fields,
    Errors,
    FormErrors,
    setError,
    setField,
    checkErrorOnSubmit,
} from "@/components/Form/formFunctions";

import {
    CenterComponent,
    StyledForm,
    FormErrorText,
    FormHeading,
    StyledFormSubmitButton,
} from "@/components/Form/formStyling";

import { useRouter } from "next/navigation";

import VoucherNumberCard from "@/app/parcels/add/formSections/VoucherNumberCard";
import PackingDateCard from "@/app/parcels/add/formSections/PackingDateCard";
import TimeOfDayCard from "@/app/parcels/add/formSections/TimeofDayCard";
import ShippingMethodCard from "@/app/parcels/add/formSections/ShippingMethodCard";
import CollectionDateCard from "@/app/parcels/add/formSections/CollectionDateCard";
import CollectionTimeCard from "@/app/parcels/add/formSections/CollectionTimeCard";
import CollectionCentreCard from "@/app/parcels/add/formSections/CollectionCentreCard";
import { insertParcel } from "@/app/clients/add/databaseFunctions";

interface AddParcelFields extends Fields {
    voucherNumber: string;
    packingDate: {
        day: number;
        month: number;
        year: number;
    } | null;
    timeOfDay: {
        hours: number;
        minutes: number;
    } | null;
    shippingMethod: string | null;
    collectionDate: {
        day: number;
        month: number;
        year: number;
    } | null;
    collectionTime: {
        hours: number;
        minutes: number;
    } | null;
    collectionCentre: string | null;
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

const initialFields: AddParcelFields = {
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
    collectionDate: Errors.none,
    collectionTime: Errors.none,
    collectionCentre: Errors.none,
};

const AddParcelForm: React.FC<{ id: string }> = (props: { id: string }) => {
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

        if (fields.packingDate === null || fields.timeOfDay === null) {
            return;
        }

        const packingDateTime = new Date(
            fields.packingDate.year,
            fields.packingDate.month,
            fields.packingDate.day,
            fields.timeOfDay.hours,
            fields.timeOfDay.minutes
        );

        let collectionDateTime = new Date();
        if (fields.shippingMethod === "Collection") {
            if (fields.collectionDate === null || fields.collectionTime === null) {
                return;
            }
            collectionDateTime = new Date(
                fields.collectionDate.year,
                fields.collectionDate.month,
                fields.collectionDate.day,
                fields.collectionTime.hours,
                fields.collectionTime.minutes
            );
        }

        let formToAdd;
        if (fields.shippingMethod === "Delivery") {
            formToAdd = {
                client_id: props.id,
                packing_datetime: packingDateTime.toISOString(),
                voucher_number: fields.voucherNumber,
                collection_centre: "Delivery",
            };
        } else {
            formToAdd = {
                client_id: props.id,
                packing_datetime: packingDateTime.toISOString(),
                collection_centre: fields.collectionCentre,
                collection_datetime: collectionDateTime.toISOString(),
                voucher_number: fields.voucherNumber,
            };
        }

        try {
            await insertParcel(formToAdd);
            router.push("/clients/");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSubmitError(Errors.external);
                setSubmitErrorMessage(error.message);
                setSubmitDisabled(false);
            }
        }

        setSubmitDisabled(false);
    };
    return (
        <CenterComponent>
            <StyledForm>
                <FormHeading>Add Parcel</FormHeading>
                {formSections.map((Card, index) => {
                    return (
                        <Card
                            key={index}
                            formErrors={formErrors}
                            formErrorSetter={setFormErrors}
                            errorSetter={errorSetter}
                            fieldSetter={fieldSetter}
                            fields={fields}
                        />
                    );
                })}
                <CenterComponent>
                    <StyledFormSubmitButton
                        type="button"
                        onClick={submitForm}
                        disabled={submitDisabled}
                    >
                        Submit
                    </StyledFormSubmitButton>
                </CenterComponent>
                <FormErrorText>{submitErrorMessage + submitError}</FormErrorText>
            </StyledForm>
        </CenterComponent>
    );
};

export default AddParcelForm;
