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
import Button from "@mui/material/Button";

interface AddParcelFields {
    voucherNumber: string;
    packingDate: Date | null;
    timeOfDay: Date | null;
    shippingMethod: string | null;
    collectionDate: Date | null;
    collectionTime: Date | null;
    collectionCentre: string | null;
}

interface AddParcelFormProps {
    id: string;
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

const mergeDateAndTime = (date: Date, time: Date): Date => {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
    );
};

const collectionCentreToKey = {
    "Brixton Hill - Methodist Church": "81e40902-fe22-43f8-8ad3-1417b376374f",
    "Clapham - St Stephens Church": "8e8398d9-d87a-4d86-aef8-da61cbe5e8ca",
    "N&B - Emmanuel Church": "4178b43c-fe2e-4fb7-a33b-233d44e3764d",
    "Streatham - Immanuel & St Andrew": "74e34dd4-c52f-47d5-b361-65d119baa69d",
    "Vauxhall Hope Church": "88b6cfda-16ea-4652-b727-168b182605de",
    "Waterloo - Oasis": "5925c0c1-3076-4d2b-a16d-c291c42b2924",
    "Waterloo - St George the Martyr": "963ed8f0-f32a-4273-8c0b-5c8671402088",
    "Waterloo - St Johns": "e0276cca-294c-4c3c-bc69-9e9e9b9f3c05",
    Delivery: "7c891da8-a4c1-4fb6-b1cd-c90ef5fbbca9",
    "": null,
};

const AddParcelForm: React.FC<AddParcelFormProps> = ({ id }) => {
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

        const collectionCentre = isDelivery ? "Delivery" : fields.collectionCentre ?? "";
        // @ts-ignore TS7053 - collectionCentre should be a key of object
        const collectionCentreId = collectionCentreToKey[collectionCentre];

        const formToAdd = {
            client_id: id,
            packing_datetime: packingDateTime.toISOString(),
            voucher_number: fields.voucherNumber,
            collection_centre: collectionCentreId,
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
                    <Button variant="contained" onClick={submitForm} disabled={submitDisabled}>
                        Add Parcel
                    </Button>
                </CenterComponent>
                <FormErrorText>{submitErrorMessage || submitError}</FormErrorText>
            </StyledForm>
        </CenterComponent>
    );
};

export default AddParcelForm;
