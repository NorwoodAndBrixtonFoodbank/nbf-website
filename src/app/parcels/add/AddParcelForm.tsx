"use client";

import React, { useState } from "react";
import {
    Fields,
    Errors,
    FormErrors,
    setError,
    setField,
    getErrorType,
    onChangeText,
    onChangeCheckbox,
    onChangeRadioGroup,
} from "@/components/Form/formFunctions";

import {
    CenterComponent,
    StyledForm,
    FormErrorText,
    FormHeading,
    FormText,
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
import ExtraParcelInformationCard from "@/app/parcels/add/formSections/ExtraParcelInformationCard";

interface AddParcelFields extends Fields {
    voucherNumber: string;
    packingDate: string;
    timeofDay: string;
    shippingMethod: string | null;
    collectionDate: string;
    collectionTime: string;
    collectionCentre: string;
    extraParcelInformation: string;
}

const withCollectionFormSections = [
    VoucherNumberCard,
    PackingDateCard,
    TimeOfDayCard,
    ShippingMethodCard,
    CollectionDateCard,
    CollectionTimeCard,
    CollectionCentreCard,
    ExtraParcelInformationCard,
];

const noCollectionFormSections = [
    VoucherNumberCard,
    PackingDateCard,
    TimeOfDayCard,
    ShippingMethodCard,
    ExtraParcelInformationCard,
];

const initialFields: AddParcelFields = {
    voucherNumber: "",
    packingDate: "",
    timeofDay: "",
    shippingMethod: null,
    collectionDate: "",
    collectionTime: "",
    collectionCentre: "",
    extraParcelInformation: "",
};

const initialFormErrors: FormErrors = {
    voucherNumber: Errors.initial,
    packingDate: Errors.initial,
    timeofDay: Errors.initial,
    shippingMethod: Errors.initial,
    collectionDate: Errors.initial,
    collectionTime: Errors.initial,
    collectionCentre: Errors.initial,
    extraParcelInformation: Errors.initial,
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
    return (
        <CenterComponent>
            <StyledForm>
                <FormHeading>Request Details</FormHeading>
                <FormText>
                    There is a section at the end of the form to add any extra information that
                    isn&apos;t covered by these questions.
                </FormText>
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
                        onClick={() => console.log(fields)}
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
