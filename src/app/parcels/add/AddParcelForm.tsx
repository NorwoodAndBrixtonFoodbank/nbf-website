"use client";

import React, { useState } from "react";
import {
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
import { insertParcel } from "@/app/parcels/add/databaseFunctions";

interface AddParcelFields {
    voucherNumber: string;
    packingDate: Date | null;
    timeOfDay: Date | null;
    shippingMethod: string | null;
    collectionDate: Date | null;
    collectionTime: Date | null;
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
    collectionDate: Errors.initial,
    collectionTime: Errors.initial,
    collectionCentre: Errors.initial,
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

    const mergeDateAndTime = (date: Date, time: Date): Date => {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes()
        );
    };

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
        if (fields.packingDate === null || fields.timeOfDay === null) {
            setSubmitDisabled(false);
            return;
        }

        const packingDateTime = mergeDateAndTime(
            new Date(fields.packingDate),
            new Date(fields.timeOfDay)
        );

        let collectionDateTime = new Date();
        if (fields.shippingMethod === "Collection") {
            if (fields.collectionDate === null || fields.collectionTime === null) {
                setSubmitDisabled(false);
                return;
            }

            collectionDateTime = mergeDateAndTime(
                new Date(fields.collectionDate),
                new Date(fields.collectionTime)
            );
        }

        const isDelivery = fields.shippingMethod === "Delivery";

        const formToAdd = {
            client_id: props.id,
            packing_datetime: packingDateTime.toISOString(),
            voucher_number: fields.voucherNumber,
            collection_centre: isDelivery ? "Delivery" : fields.collectionCentre,
            collection_datetime: isDelivery ? null : collectionDateTime.toISOString(),
        };
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
                            errorSetter={errorSetter}
                            fieldSetter={fieldSetter}
                            fields={fields}
                        />
                    );
                })}
                <CenterComponent>
                    <StyledFormSubmitButton onClick={submitForm} disabled={submitDisabled}>
                        Add Parcel
                    </StyledFormSubmitButton>
                </CenterComponent>
                <FormErrorText>
                    {submitErrorMessage === "" ? submitError : submitErrorMessage}
                </FormErrorText>
            </StyledForm>
        </CenterComponent>
    );
};

export default AddParcelForm;
