"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { booleanGroup } from "@/components/DataInput/inputHandlerFactories";
import {
    checkboxGroupToArray,
    checkErrorOnSubmit,
    Errors,
    Fields,
    FormErrors,
    Person,
    setError,
    setField,
} from "@/components/Form/formFunctions";
import {
    CenterComponent,
    FormErrorText,
    FormHeading,
    FormText,
    StyledForm,
} from "@/components/Form/formStyling";
import FullNameCard from "@/app/clients/add/formSections/FullNameCard";
import PhoneNumberCard from "@/app/clients/add/formSections/PhoneNumberCard";
import AddressCard from "@/app/clients/add/formSections/AddressCard";
import NumberAdultsCard from "@/app/clients/add/formSections/NumberAdultsCard";
import NumberChildrenCard from "@/app/clients/add/formSections/NumberChildrenCard";
import DietaryRequirementCard from "@/app/clients/add/formSections/DietaryRequirementCard";
import FeminineProductCard from "@/app/clients/add/formSections/FeminineProductCard";
import BabyProductCard from "@/app/clients/add/formSections/BabyProductCard";
import PetFoodCard from "@/app/clients/add/formSections/PetFoodCard";
import OtherItemsCard from "@/app/clients/add/formSections/OtherItemsCard";
import DeliveryInstructionsCard from "@/app/clients/add/formSections/DeliveryInstructionsCard";
import ExtraInformationCard from "@/app/clients/add/formSections/ExtraInformationCard";
import AttentionFlagCard from "@/app/clients/add/formSections/AttentionFlagCard";
import SignpostingCallCard from "@/app/clients/add/formSections/SignpostingCallCard";
import {
    ClientDatabaseInsertRecord,
    deleteFailedInsert,
    insertClient,
    insertFamily,
} from "@/app/clients/add/databaseFunctions";
import { Button } from "@mui/material";

interface AddClientFields extends Fields {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    addressTown: string;
    addressCounty: string;
    addressPostcode: string;
    adults: Person[];
    numberChildren: number;
    children: Person[];
    dietaryRequirements: booleanGroup;
    feminineProducts: booleanGroup;
    babyProducts: boolean | null;
    nappySize: string;
    petFood: booleanGroup;
    otherItems: booleanGroup;
    deliveryInstructions: string;
    extraInformation: string;
    attentionFlag: boolean;
    signpostingCall: boolean;
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

const initialFields: AddClientFields = {
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    addressTown: "",
    addressCounty: "",
    addressPostcode: "",
    adults: [
        { gender: "other", quantity: 0 },
        { gender: "male", quantity: 0 },
        { gender: "female", quantity: 0 },
    ],
    numberChildren: 0,
    children: [],
    dietaryRequirements: {},
    feminineProducts: {},
    babyProducts: null,
    nappySize: "",
    petFood: {},
    otherItems: {},
    deliveryInstructions: "",
    extraInformation: "",
    attentionFlag: false,
    signpostingCall: false,
};

const initialFormErrors: FormErrors = {
    fullName: Errors.initial,
    phoneNumber: Errors.none,
    addressLine1: Errors.initial,
    addressPostcode: Errors.initial,
    adults: Errors.initial,
    numberChildren: Errors.initial,
    nappySize: Errors.none,
};

const AddClientForm: React.FC = () => {
    const router = useRouter();
    const [fields, setFields] = useState(initialFields);
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

        const extraInformationWithNappy =
            fields.nappySize === ""
                ? fields.extraInformation
                : `Nappy Size: ${fields.nappySize}, Extra Information: ${fields.extraInformation}`;

        const clientRecord: ClientDatabaseInsertRecord = {
            full_name: fields.fullName,
            phone_number: fields.phoneNumber,
            address_1: fields.addressLine1,
            address_2: fields.addressLine2,
            address_town: fields.addressTown,
            address_county: fields.addressCounty,
            address_postcode: fields.addressPostcode,
            dietary_requirements: checkboxGroupToArray(fields.dietaryRequirements),
            feminine_products: checkboxGroupToArray(fields.feminineProducts),
            baby_food: fields.babyProducts,
            pet_food: checkboxGroupToArray(fields.petFood),
            other_items: checkboxGroupToArray(fields.otherItems),
            delivery_instructions: fields.deliveryInstructions,
            extra_information: extraInformationWithNappy,
            signposting_call_required: fields.signpostingCall,
            flagged_for_attention: fields.attentionFlag,
        };

        const inputError = checkErrorOnSubmit(formErrors, setFormErrors);
        if (inputError) {
            setSubmitError(Errors.submit);
            setSubmitDisabled(false);
            return;
        }

        try {
            const ids = await insertClient(clientRecord);
            try {
                await insertFamily([...fields.adults, ...fields.children], ids.family_id);
                router.push("/clients");
            } catch (error) {
                await deleteFailedInsert(ids.primary_key);
                throw error;
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
                <FormHeading>Client Form</FormHeading>
                <FormText>
                    Please provide or update the client&apos;s personal details, household
                    composition, dietary restrictions and other needs.
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
                    <Button variant="contained" onClick={submitForm} disabled={submitDisabled}>
                        Add Client
                    </Button>
                </CenterComponent>
                <FormErrorText>{submitErrorMessage + submitError}</FormErrorText>
            </StyledForm>
        </CenterComponent>
    );
};

export default AddClientForm;
