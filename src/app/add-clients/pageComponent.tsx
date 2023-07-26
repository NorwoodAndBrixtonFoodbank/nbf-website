"use client";

import React, { useEffect, useState } from "react";
import {
    setErrorFunction,
    setFieldFunction,
    Fields,
    ErrorMessages,
    onChangeFunction,
    getNumberAdults,
    numberRegex,
    phoneNumberRegex,
    postcodeRegex,
    People,
    getChild,
    onChangeCheckbox,
    getBaby,
    checkErrorOnSubmit,
    insertClient,
    insertFamily,
    ClientDatabaseRecord,
    formatPhoneNumber,
    formatPostcode,
    checkboxGroupToArray,
} from "@/app/add-clients/helperFunctions";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { errorExists, errorText } from "@/app/add-clients/helperFunctions";
import styled from "styled-components";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import CheckboxGroupInput from "@/components/DataInput/CheckboxGroupInput";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";

const CenterComponent = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    margin: 2em;
`;

const StyledForm = styled.form`
    width: 90%;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
`;

const StyledCard = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2em;
    margin: 2em;
    width: 100%;
    height: 80%;
    border-radius: 10px;
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
    color: ${(props) => props.theme.surfaceForegroundColor};

    div {
        width: 100%;
        margin: 0.15em 0;
    }
`;

const Text = styled.p`
    padding-bottom: 1em;
`;

const Subheading = styled.h2`
    padding-bottom: 1em;
`;

const Heading = styled.h1`
    padding-bottom: 1em;
`;

const RequiredAsterisk = styled.span`
    color: ${(props) => props.theme.errorColor};

    &:before {
        content: "*";
    }
`;

const ErrorText = styled(Text)`
    color: ${(props) => props.theme.errorColor};
    margin-bottom: 3em;
    text-align: center;
`;

const StyledButton = styled.button`
    text-align: center;
    width: 150px;
    height: 40px;
    border-radius: 10px;
    border: solid 0px ${(props) => props.theme.foregroundColor};
    background-color: ${(props) => props.theme.primaryBackgroundColor};
    color: ${(props) => props.theme.primaryForegroundColor};

    &:hover {
        background-color: ${(props) => props.theme.secondaryBackgroundColor};
        color: ${(props) => props.theme.secondaryForegroundColor};
    }
`;

const genericFormCard = (
    title: string,
    required: boolean,
    childComponent: React.ReactNode,
    text?: string
): React.ReactNode => {
    return (
        <>
            <StyledCard>
                <Subheading>
                    {title} {required && <RequiredAsterisk />}
                </Subheading>
                <Text>{text}</Text>
                {childComponent}
            </StyledCard>
        </>
    );
};

const initialFields: Fields = {
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    addressTown: "",
    addressCounty: "",
    addressPostcode: "",
    adults: [
        { personType: "adult", quantity: 0 },
        { personType: "male", quantity: 0 },
        { personType: "female", quantity: 0 },
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
};

const initialErrorMessages: ErrorMessages = {
    fullName: "N/A",
    phoneNumber: "",
    addressLine1: "N/A",
    addressPostcode: "N/A",
    adults: "N/A",
    numberChildren: "N/A",
    nappySize: "",
};

const AddClientForm: React.FC = () => {
    const [fields, setFields] = useState<Fields>(initialFields);
    const [errorMessages, setErrorMessages] = useState<ErrorMessages>(initialErrorMessages);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        const childrenCopy: People[] = [];
        for (let index = 0; index < fields.numberChildren; index++) {
            if (index < fields.children.length) {
                childrenCopy.push(fields.children[index]);
            } else {
                childrenCopy.push({ personType: "child", age: null, quantity: 1 });
            }
        }
        fieldSetter("children", childrenCopy);
    }, [fields.numberChildren]); // eslint-disable-line

    const fieldSetter = setFieldFunction(setFields, fields);
    const errorSetter = setErrorFunction(setErrorMessages, errorMessages);

    const submitForm = async (): Promise<void> => {
        let extraInformationWithNappy = fields.extraInformation;
        if (fields.nappySize !== "") {
            extraInformationWithNappy = `Nappy Size: ${fields.nappySize}, Extra Information: ${fields.extraInformation}`;
        }
        const clientRecord: ClientDatabaseRecord = {
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
        };
        console.log(clientRecord);
        const inputError = checkErrorOnSubmit(errorMessages, setErrorMessages);
        if (!inputError) {
            setSubmitError("");
            const familyID = await insertClient(clientRecord);
            if (familyID !== null) {
                const familySuccess = await insertFamily(
                    [...fields.adults, ...fields.children],
                    familyID
                );
                if (!familySuccess) {
                    setSubmitError("An error has occurred. Please try again later.");
                }
            } else {
                setSubmitError("An error has occurred. Please try again later.");
            }
        } else {
            setSubmitError(
                "Please ensure all fields have been entered correctly. Required fields are labelled with an asterisk."
            );
        }
    };

    const fullNameCard: React.ReactNode = genericFormCard(
        "Client Full Name",
        true,
        <FreeFormTextInput
            label="Name"
            error={errorExists(errorMessages.fullName)}
            helperText={errorText(errorMessages.fullName)}
            onChange={onChangeFunction(fieldSetter, errorSetter, "fullName", true)}
        />,
        "First and last name"
    );

    const phoneNumberCard = genericFormCard(
        "Phone Number",
        false,
        <FreeFormTextInput
            label="Phone Number"
            error={errorExists(errorMessages.phoneNumber)}
            helperText={errorText(errorMessages.phoneNumber)}
            onChange={onChangeFunction(
                fieldSetter,
                errorSetter,
                "phoneNumber",
                false,
                phoneNumberRegex,
                formatPhoneNumber
            )}
        />,
        "UK Mobile numbers should start with a 0 or a +44. International mobile numbers should be entered with a country code."
    );

    const addressCard = genericFormCard(
        "Address",
        true,
        <>
            <FreeFormTextInput
                label="Address Line 1*"
                error={errorExists(errorMessages.addressLine1)}
                helperText={errorText(errorMessages.addressLine1)}
                onChange={onChangeFunction(fieldSetter, errorSetter, "addressLine1", true)}
            />
            <FreeFormTextInput
                label="Address Line 2"
                onChange={onChangeFunction(fieldSetter, errorSetter, "addressLine2", false)}
            />
            <FreeFormTextInput
                label="Town"
                onChange={onChangeFunction(fieldSetter, errorSetter, "addressTown", false)}
            />
            <FreeFormTextInput
                label="County"
                onChange={onChangeFunction(fieldSetter, errorSetter, "addressCounty", false)}
            />
            <FreeFormTextInput
                label="Postcode* (e.g. SE11 5QY)"
                error={errorExists(errorMessages.addressPostcode)}
                helperText={errorText(errorMessages.addressPostcode)}
                onChange={onChangeFunction(
                    fieldSetter,
                    errorSetter,
                    "addressPostcode",
                    true,
                    postcodeRegex,
                    formatPostcode
                )}
            />
        </>,
        "Please enter the flat/house number if applicable."
    );

    const numberAdultsCard = genericFormCard(
        "Number of Adults",
        true,
        <>
            <FreeFormTextInput
                error={errorExists(errorMessages.adults)}
                label="Female"
                onChange={getNumberAdults(fieldSetter, errorSetter, fields.adults, "female")}
            />
            <FreeFormTextInput
                error={errorExists(errorMessages.adults)}
                label="Male"
                onChange={getNumberAdults(fieldSetter, errorSetter, fields.adults, "male")}
            />
            <FreeFormTextInput
                error={errorExists(errorMessages.adults)}
                helperText={errorText(errorMessages.adults)}
                label="Prefer Not To Say"
                onChange={getNumberAdults(fieldSetter, errorSetter, fields.adults, "adult")}
            />
        </>,
        "Please enter the number of adults (aged 16 or above) in the appropriate category."
    );

    const numberChildrenCard = genericFormCard(
        "Number of Children",
        true,
        <>
            <FreeFormTextInput
                label="Number of Children"
                error={errorExists(errorMessages.numberChildren)}
                helperText={errorText(errorMessages.numberChildren)}
                onChange={onChangeFunction(
                    fieldSetter,
                    errorSetter,
                    "numberChildren",
                    true,
                    numberRegex,
                    parseInt
                )}
            />
            {fields.children.map((child, index) => {
                return (
                    <StyledCard key={index}>
                        <Text>Child {index + 1}</Text>
                        <DropdownListInput
                            labelsAndValues={[
                                ["Boy", "boy"],
                                ["Girl", "girl"],
                                ["Prefer Not To Say", "child"],
                                ["Don't Know", "don't know"],
                            ]}
                            listTitle="Gender"
                            defaultValue="don't know"
                            onChange={getChild(fieldSetter, fields.children, index, "personType")}
                        />
                        <DropdownListInput
                            labelsAndValues={[
                                ["<1", "0"],
                                ["1", "1"],
                                ["2", "2"],
                                ["3", "3"],
                                ["4", "4"],
                                ["5", "5"],
                                ["6", "6"],
                                ["7", "7"],
                                ["8", "8"],
                                ["9", "9"],
                                ["10", "10"],
                                ["11", "11"],
                                ["12", "12"],
                                ["13", "13"],
                                ["14", "14"],
                                ["15", "15"],
                                ["Don't Know", "don't know"],
                            ]}
                            listTitle="Age"
                            defaultValue="don't know"
                            onChange={getChild(fieldSetter, fields.children, index, "age")}
                        />
                    </StyledCard>
                );
            })}
        </>,
        "Please note that children are under 16 years old."
    );

    const dietaryRequirementCard = genericFormCard(
        "Dietary Requirements",
        false,
        <CheckboxGroupInput
            labelsAndKeys={[
                ["Gluten Free", "Gluten Free"],
                ["Dairy Free", "Dairy Free"],
                ["Vegetarian", "Vegetarian"],
                ["Vegan", "Vegan"],
                ["Pescatarian", "Pescatarian"],
                ["Halal", "Halal"],
                ["Diabetic", "Diabetic"],
                ["Nut Allergy", "Nut Allergy"],
                ["Seafood Allergy", "Seafood Allergy"],
                ["No Bread", "No Bread"],
                ["No Pasta", "No Pasta"],
                ["No Rice", "No Rice"],
                ["No Pork", "No Pork"],
                ["No Beef", "No Beef"],
            ]}
            onChange={onChangeCheckbox(
                fieldSetter,
                fields.dietaryRequirements,
                "dietaryRequirements"
            )}
        />,
        "Tick all that apply"
    );

    const feminineProductCard = genericFormCard(
        "Feminine Products",
        false,
        <CheckboxGroupInput
            labelsAndKeys={[
                ["Tampons", "Tampons"],
                ["Pads", "Pads"],
                ["Incontinence Pads", "Incontinence Pads"],
            ]}
            onChange={onChangeCheckbox(fieldSetter, fields.feminineProducts, "feminineProducts")}
        />
    );

    const babyProductCard = genericFormCard(
        "Baby Products",
        true,
        <>
            <RadioGroupInput
                labelsAndValues={[
                    ["Yes", "Yes"],
                    ["No", "No"],
                    ["Don't Know", "don't know"],
                ]}
                defaultValue="don't know"
                onChange={getBaby(fieldSetter, errorSetter)}
            />
            {fields.babyProducts ? (
                <>
                    <FreeFormTextInput
                        error={errorExists(errorMessages.nappySize)}
                        helperText={errorText(errorMessages.nappySize)}
                        label="Nappy Size"
                        onChange={onChangeFunction(fieldSetter, errorSetter, "nappySize", true)}
                    />
                </>
            ) : (
                <></>
            )}
        </>,
        "Includes Baby Food, Wet Wipes, Nappies etc."
    );

    const petFoodCard = genericFormCard(
        "Pet Food",
        false,
        <CheckboxGroupInput
            labelsAndKeys={[
                ["Cat", "Cat"],
                ["Dog", "Dog"],
            ]}
            onChange={onChangeCheckbox(fieldSetter, fields.petFood, "petFood")}
        />
    );

    const otherItemsCard = genericFormCard(
        "Other Items",
        false,
        <CheckboxGroupInput
            labelsAndKeys={[
                ["Garlic", "Garlic"],
                ["Ginger", "Ginger"],
                ["Chilies", "Chilies"],
                ["Spices", "Spices"],
                ["Hot Water Bottles", "Hot Water Bottles"],
                ["Blankets", "Blankets"],
            ]}
            onChange={onChangeCheckbox(fieldSetter, fields.otherItems, "otherItems")}
        />
    );

    const deliveryInstructionsCard = genericFormCard(
        "Delivery Instructions",
        false,
        <FreeFormTextInput
            label="E.g. The doorbell does not work. Use the door code: xxxx."
            onChange={onChangeFunction(fieldSetter, errorSetter, "deliveryInstructions")}
        />
    );

    const extraInformationCard = genericFormCard(
        "Extra Information",
        false,
        <FreeFormTextInput
            label="E.g. Tea allergy"
            onChange={onChangeFunction(fieldSetter, errorSetter, "extraInformation")}
        />,
        "Is there anything else you need to tell us about the client? Comments relating to food or anything else. Please add any delivery instructions to the 'Delivery Instructions' section above."
    );

    return (
        <CenterComponent>
            <StyledForm>
                <Heading>Client Form</Heading>
                <Text>
                    Please provide or update the client&apos;s personal details, household
                    composition, dietary restrictions and other needs.
                </Text>
                {fullNameCard}
                {phoneNumberCard}
                {addressCard}
                {numberAdultsCard}
                {numberChildrenCard}
                {dietaryRequirementCard}
                {feminineProductCard}
                {babyProductCard}
                {petFoodCard}
                {otherItemsCard}
                {deliveryInstructionsCard}
                {extraInformationCard}
                <CenterComponent>
                    <StyledButton type="button" onClick={submitForm}>
                        Submit
                    </StyledButton>
                </CenterComponent>
                <ErrorText>{submitError}</ErrorText>
            </StyledForm>
        </CenterComponent>
    );
};

export default AddClientForm;
