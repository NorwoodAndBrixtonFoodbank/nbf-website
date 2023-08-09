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

    const submitForm = async (): Promise<void> => {
        setSubmitDisabled(false);
        let inputError;
        console.log("submitting");
        if (fields.shippingMethod === "Collection") {
            console.log("collection inputerror");
            inputError = checkErrorOnSubmit(formErrors, setFormErrors);
            console.log(formErrors);
        } else {
            console.log("no collection inputerror");
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
        console.log("noInputError");
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

        const deliveryBool: boolean = fields.shippingMethod === "Delivery";

        const formToAdd = {
            client_id: props.id,
            packing_datetime: packingDateTime.toISOString(),
            voucher_number: fields.voucherNumber,
            collection_centre: deliveryBool ? "Delivery" : fields.collectionCentre,
            collection_datetime: deliveryBool ? null : collectionDateTime.toISOString(),
        };
        console.log("success");
        console.log("formToAdd", formToAdd);
        // try {
        //     await insertParcel(formToAdd);
        //     router.push("/clients/");
        // } catch (error: unknown) {
        //     if (error instanceof Error) {
        //         setSubmitError(Errors.external);
        //         setSubmitErrorMessage(error.message);
        //         setSubmitDisabled(false);
        //     }
        // }

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
