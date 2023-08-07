"use client";

import React, { useState } from "react";
import { Fields, Errors, FormErrors, setError, setField } from "@/components/Form/formFunctions";

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
import TimeOfDayCard from "@/app/parcels/add/formSections/TimeOfDayCard";
import ShippingMethodCard from "@/app/parcels/add/formSections/ShippingMethodCard";
import CollectionDateCard from "@/app/parcels/add/formSections/CollectionDateCard";
import CollectionTimeCard from "@/app/parcels/add/formSections/CollectionTimeCard";
import CollectionCentreCard from "@/app/parcels/add/formSections/CollectionCentreCard";

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
    packingDate: Errors.none,
    timeOfDay: Errors.none,
    shippingMethod: Errors.none,
    collectionDate: Errors.none,
    collectionTime: Errors.none,
    collectionCentre: Errors.none,
};

const AddParcelForm: React.FC = () => {
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

    const submitForm = (): void => {
        if (fields.packingDate === null) {
            console.log("Packing Date is null");
            return;
        }
        if (fields.timeOfDay === null) {
            console.log("Time of Day is null");
            return;
        }
        const packingDateTime = new Date(
            fields.packingDate.year,
            fields.packingDate.month,
            fields.packingDate.day,
            fields.timeOfDay.hours,
            fields.timeOfDay.minutes
        );

        let collectionDateTime = null;
        if (fields.shippingMethod === "Collection") {
            if (fields.collectionDate === null) {
                console.log("Collection Date is null");
                return;
            }
            if (fields.collectionTime === null) {
                console.log("Collection Time is null");
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
        const submitFields =
            fields.shippingMethod === "Delivery"
                ? {
                    client_id: "",
                    packing_datetime: packingDateTime,
                    primary_key: "",
                    voucher_number: fields.voucherNumber,
                }
                : {
                    client_id: "",
                    packing_datetime: packingDateTime,
                    collection_centre: fields.collectionCentre,
                    collection_datetime: collectionDateTime,
                    primary_key: "",
                    voucher_number: fields.voucherNumber,
                };
        console.log(submitFields);
    };
    return (
        <CenterComponent>
            <StyledForm>
                <FormHeading>Request Details</FormHeading>
                {formSections.map((Card, index) => {
                    return (
                        <Card
                            key={index}
                            formErrors={formErrors}
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
