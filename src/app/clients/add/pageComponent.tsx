"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    setError,
    setField,
    Fields,
    ErrorType,
    onChange,
    getNumberAdults,
    numberRegex,
    phoneNumberRegex,
    postcodeRegex,
    Error,
    Person,
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
    maxNumberChildren,
} from "@/app/clients/add/helperFunctions";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { errorExists } from "@/app/clients/add/helperFunctions";
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
    border: solid 0 ${(props) => props.theme.foregroundColor};
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

const initialErrorTypes: ErrorType = {
    fullName: Error.initial,
    phoneNumber: Error.none,
    addressLine1: Error.initial,
    addressPostcode: Error.initial,
    adults: Error.initial,
    numberChildren: Error.initial,
    nappySize: Error.none,
};

const AddClientForm: React.FC = () => {
    const router = useRouter();
    const [fields, setFields] = useState<Fields>(initialFields);
    const [errorType, setErrorType] = useState<ErrorType>(initialErrorTypes);
    const [submitError, setSubmitError] = useState<Error>(Error.none);

    useEffect(() => {
        const childrenCopy: Person[] = [];
        for (let index = 0; index < fields.numberChildren; index++) {
            if (index < fields.children.length) {
                childrenCopy.push(fields.children[index]);
            } else {
                childrenCopy.push({ personType: "child", age: null, quantity: 1 });
            }
        }
        fieldSetter("children", childrenCopy);
    }, [fields.numberChildren]); // eslint-disable-line

    const fieldSetter = setField(setFields, fields);
    const errorSetter = setError(setErrorType, errorType);

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
        const inputError = checkErrorOnSubmit(errorType, setErrorType);
        let submitErrorValue = Error.none;
        if (!inputError) {
            const familyID = await insertClient(clientRecord);
            const insertSuccess = await insertFamily(
                [...fields.adults, ...fields.children],
                familyID
            );
            if (insertSuccess) {
                router.push("/clients");
            } else {
                submitErrorValue = Error.database;
            }
        } else {
            submitErrorValue = Error.submit;
        }
        setSubmitError(submitErrorValue);
    };

    const fullNameCard: React.ReactNode = genericFormCard(
        "Client Full Name",
        true,
        <FreeFormTextInput
            label="Name"
            error={errorExists(errorType.fullName)}
            helperText={errorType.fullName}
            onChange={onChange(fieldSetter, errorSetter, "fullName", true)}
        />,
        "First and last name"
    );

    const phoneNumberCard = genericFormCard(
        "Phone Number",
        false,
        <FreeFormTextInput
            label="Phone Number"
            error={errorExists(errorType.phoneNumber)}
            helperText={errorType.phoneNumber}
            onChange={onChange(
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
                label="Address Line 1"
                error={errorExists(errorType.addressLine1)}
                helperText={errorType.addressLine1}
                onChange={onChange(fieldSetter, errorSetter, "addressLine1", true)}
            />
            <FreeFormTextInput
                label="Address Line 2"
                onChange={onChange(fieldSetter, errorSetter, "addressLine2", false)}
            />
            <FreeFormTextInput
                label="Town"
                onChange={onChange(fieldSetter, errorSetter, "addressTown", false)}
            />
            <FreeFormTextInput
                label="County"
                onChange={onChange(fieldSetter, errorSetter, "addressCounty", false)}
            />
            <FreeFormTextInput
                label="Postcode (e.g. SE11 5QY)"
                error={errorExists(errorType.addressPostcode)}
                helperText={errorType.addressPostcode}
                onChange={onChange(
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
                error={errorExists(errorType.adults)}
                label="Female"
                onChange={getNumberAdults(fieldSetter, errorSetter, fields.adults, "female")}
            />
            <FreeFormTextInput
                error={errorExists(errorType.adults)}
                label="Male"
                onChange={getNumberAdults(fieldSetter, errorSetter, fields.adults, "male")}
            />
            <FreeFormTextInput
                error={errorExists(errorType.adults)}
                helperText={errorType.adults}
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
                error={errorExists(errorType.numberChildren)}
                helperText={errorType.numberChildren}
                onChange={onChange(
                    fieldSetter,
                    errorSetter,
                    "numberChildren",
                    true,
                    numberRegex,
                    parseInt,
                    maxNumberChildren
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
                        error={errorExists(errorType.nappySize)}
                        helperText={errorType.nappySize}
                        label="Nappy Size"
                        onChange={onChange(fieldSetter, errorSetter, "nappySize", true)}
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
        />,
        "Tick all that apply. Specify any other requests in the 'Extra Information' section."
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
            onChange={onChange(fieldSetter, errorSetter, "deliveryInstructions")}
        />
    );

    const extraInformationCard = genericFormCard(
        "Extra Information",
        false,
        <FreeFormTextInput
            label="E.g. Tea allergy"
            onChange={onChange(fieldSetter, errorSetter, "extraInformation")}
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
