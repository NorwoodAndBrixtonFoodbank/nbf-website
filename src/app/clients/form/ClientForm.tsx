"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BooleanGroup } from "@/components/DataInput/inputHandlerFactories";
import {
    CardProps,
    checkErrorOnSubmit,
    Errors,
    Fields,
    FormErrors,
    NumberAdultsByGender,
    Person,
    setError,
    setField,
} from "@/components/Form/formFunctions";
import {
    CenterComponent,
    FormErrorText,
    FormText,
    StyledForm,
} from "@/components/Form/formStyling";
import FullNameCard from "@/app/clients/form/formSections/FullNameCard";
import PhoneNumberCard from "@/app/clients/form/formSections/PhoneNumberCard";
import AddressCard from "@/app/clients/form/formSections/AddressCard";
import NumberAdultsCard from "@/app/clients/form/formSections/NumberAdultsCard";
import NumberChildrenCard from "@/app/clients/form/formSections/NumberChildrenCard";
import DietaryRequirementCard from "@/app/clients/form/formSections/DietaryRequirementCard";
import FeminineProductCard from "@/app/clients/form/formSections/FeminineProductCard";
import BabyProductCard from "@/app/clients/form/formSections/BabyProductCard";
import PetFoodCard from "@/app/clients/form/formSections/PetFoodCard";
import OtherItemsCard from "@/app/clients/form/formSections/OtherItemsCard";
import DeliveryInstructionsCard from "@/app/clients/form/formSections/DeliveryInstructionsCard";
import ExtraInformationCard from "@/app/clients/form/formSections/ExtraInformationCard";
import AttentionFlagCard from "@/app/clients/form/formSections/AttentionFlagCard";
import SignpostingCallCard from "@/app/clients/form/formSections/SignpostingCallCard";
import Button from "@mui/material/Button";
import { submitAddClientForm, submitEditClientForm } from "@/app/clients/form/submitFormHelpers";
import Title from "@/components/Title/Title";

interface Props {
    initialFields: ClientFields;
    initialFormErrors: FormErrors;
    editConfig: EditConfig;
}

type EditConfig = { editMode: true; clientID: string } | { editMode: false };

export interface ClientFields extends Fields {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    addressTown: string;
    addressCounty: string;
    addressPostcode: string;
    adults: NumberAdultsByGender;
    numberChildren: number;
    children: Person[];
    dietaryRequirements: BooleanGroup;
    feminineProducts: BooleanGroup;
    babyProducts: boolean | null;
    nappySize: string;
    petFood: BooleanGroup;
    otherItems: BooleanGroup;
    deliveryInstructions: string;
    extraInformation: string;
    attentionFlag: boolean;
    signpostingCall: boolean;
}

export interface ClientCardProps extends CardProps {
    fields: ClientFields;
}

const formSections = [
    FullNameCard,
    PhoneNumberCard,
    AddressCard,
    NumberAdultsCard,
    NumberChildrenCard,
    DietaryRequirementCard,
    FeminineProductCard,
    BabyProductCard,
    PetFoodCard,
    OtherItemsCard,
    DeliveryInstructionsCard,
    AttentionFlagCard,
    SignpostingCallCard,
    ExtraInformationCard,
];

const ClientForm: React.FC<Props> = ({ initialFields, initialFormErrors, editConfig }) => {
    const router = useRouter();
    const [fields, setFields] = useState<ClientFields>(initialFields);
    const [formErrors, setFormErrors] = useState(initialFormErrors);
    const [submitError, setSubmitError] = useState(Errors.none);
    const [submitErrorMessage, setSubmitErrorMessage] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(false);

    useEffect(() => {
        if (fields.numberChildren <= fields.children.length) {
            fieldSetter("children", fields.children.slice(0, fields.numberChildren));
            return;
        }

        const extraChildren: Person[] = Array(fields.numberChildren - fields.children.length)
            .fill(0)
            .map((_item) => {
                return {
                    gender: "other",
                    age: -1,
                };
            });
        fieldSetter("children", [...fields.children, ...extraChildren]);
    }, [fields.numberChildren]); // eslint-disable-line react-hooks/exhaustive-deps

    const fieldSetter = setField(setFields, fields);
    const errorSetter = setError(setFormErrors, formErrors);

    const submitForm = async (): Promise<void> => {
        setSubmitDisabled(true);

        const inputError = checkErrorOnSubmit(formErrors, setFormErrors);
        if (inputError) {
            setSubmitError(Errors.submit);
            setSubmitDisabled(false);
            return;
        }

        try {
            if (editConfig.editMode) {
                await submitEditClientForm(fields, router, editConfig.clientID);
            } else {
                await submitAddClientForm(fields, router);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSubmitError(Errors.external);
                setSubmitErrorMessage(error.message);
                setSubmitDisabled(false);
            }
        }
    };

    return (
        <CenterComponent>
            <StyledForm>
                <Title>Client Form</Title>
                <FormText>
                    Please provide or update the client&apos;s personal details, household
                    composition, dietary restrictions and other needs.
                </FormText>
                {formSections.map((Card, index) => {
                    return (
                        <Card
                            key={index} // eslint-disable-line react/no-array-index-key
                            formErrors={formErrors}
                            errorSetter={errorSetter}
                            fieldSetter={fieldSetter}
                            fields={fields}
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

export default ClientForm;
