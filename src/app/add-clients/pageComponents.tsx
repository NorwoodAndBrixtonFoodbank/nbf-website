"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import CheckboxGroupInput from "@/components/DataInput/CheckboxGroupInput";
import {
    booleanGroup,
    getCheckboxGroupHandler,
} from "@/components/DataInput/inputHandlerFactories";
import { SelectChangeEvent } from "@mui/material";
import supabase, { InsertSchema } from "@/supabase";
import { Database } from "@/database_types_file";

type ClientDatabaseRecord = InsertSchema["clients"];
type FamilyDatabaseRecord = InsertSchema["families"];
type PersonType = Database["public"]["Enums"]["gender"];
type GenderToAge = {
    [gender in PersonType]?: number;
};

interface ChildProps {
    key: number;
    gender: PersonType;
    age: number | null;
}

interface ErrorMessages {
    nameErrorMessage: string;
    phoneErrorMessage: string;
    addressErrorMessage: string;
    postcodeErrorMessage: string;
    numberAdultsErrorMessage: string;
    numberChildrenErrorMessage: string;
    nappyErrorMessage: string;
}

const CenterComponent = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    padding-block: 1rem;
    background-color: ${(props) => props.theme.backgroundColor};
`;

const StyledForm = styled.div`
    margin: 2em;
    color: ${(props) => props.theme.foregroundColor};
    width: 90%;
`;

const StyledCard = styled.div`
    padding: 2em 2em;
    width: 100%;
    height: 80%;
    border-radius: 10px;
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
    color: ${(props) => props.theme.surfaceForegroundColor};

    div {
        background-color: inherit;
        color: inherit;
        width: 100%;
        margin-top: 0.15em;
        margin-bottom: 0.15em;
    }
`;

const Text = styled.p`
    text-align: left;
    padding-bottom: 1em;
    font-weight: lighter;
`;

const Heading = styled(Text)`
    font-size: xx-large;
    font-weight: bold;
`;

const Subheading = styled(Text)`
    font-size: large;
    font-weight: bolder;
`;

const Asterisk = styled.span`
    color: red;
`;

const StyledButton = styled.button`
    text-align: center;
    width: 100px;
    height: 30px;
    border-radius: 10px;
    border: solid 1px ${(props) => props.theme.foregroundColor};
    background-color: ${(props) => props.theme.primaryBackgroundColor};
    color: ${(props) => props.theme.primaryForegroundColor};

    &:hover {
        background-color: ${(props) => props.theme.secondaryBackgroundColor};
        color: ${(props) => props.theme.secondaryForegroundColor};
    }
`;

const initialErrorMessages = {
    nameErrorMessage: "N/A",
    phoneErrorMessage: "",
    addressErrorMessage: "N/A",
    postcodeErrorMessage: "N/A",
    numberAdultsErrorMessage: "N/A",
    numberChildrenErrorMessage: "N/A",
    nappyErrorMessage: "",
};

const RequestForm: React.FC<{}> = () => {
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [addressTown, setAddressTown] = useState("");
    const [addressCounty, setAddressCounty] = useState("");
    const [addressPostcode, setAddressPostcode] = useState("");
    const [numberAdults, setNumberAdults] = useState<GenderToAge>({ female: 0, male: 0, adult: 0 });
    const [numberChildren, setNumberChildren] = useState(0);
    const [ageGenderChildren, setAgeGenderChildren] = useState<ChildProps[]>([]);
    const [babyProducts, setBabyProducts] = useState<boolean | null>(null);
    const [nappySize, setNappySize] = useState("");
    const [deliveryInstructions, setDeliveryInstruction] = useState("");
    const [feminineProducts, setFeminineProducts] = useState({});
    const [petFood, setPetFood] = useState({});
    const [otherItems, setOtherItems] = useState({});
    const [dietaryRequirements, setDietaryRequirements] = useState({});
    const [extraInformation, setExtraInformation] = useState("");

    const [errorMessages, setErrorMessages] = useState<ErrorMessages>(initialErrorMessages);

    useEffect(() => {
        const defaultAgeGenderChildren = Array.from(
            { length: numberChildren },
            (value, index): ChildProps => {
                return {
                    key: index,
                    gender: "child",
                    age: null,
                };
            }
        );
        setAgeGenderChildren(defaultAgeGenderChildren);
    }, [numberChildren]);

    const getFullName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.target.value;
        if (input === "") {
            setErrorMessages({ ...errorMessages, nameErrorMessage: "This is a required field" });
        } else {
            setErrorMessages({ ...errorMessages, nameErrorMessage: "" });
            setFullName(event.target.value);
        }
    };

    const getPhoneNumber = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const phoneNumberPattern = /^(\+|0)(\s?)(\s|\d+|-){5,}$/;
        const input = event.target.value;
        if (input === "" || input.match(phoneNumberPattern)) {
            setErrorMessages({ ...errorMessages, phoneErrorMessage: "" });
        } else {
            setErrorMessages({
                ...errorMessages,
                phoneErrorMessage: "Please enter a valid phone number",
            });
        }
        const numericInput = input.replace(/(\D)/g, "");
        const formattedNumber =
            numericInput[0] === "0" ? "+44" + numericInput.slice(1) : "+" + numericInput;
        setPhoneNumber(formattedNumber);
    };

    const getAddressLine1 = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.target.value;
        if (input === "") {
            setErrorMessages({ ...errorMessages, addressErrorMessage: "This is a required field" });
        } else {
            setErrorMessages({ ...errorMessages, addressErrorMessage: "" });
            setAddressLine1(event.target.value);
        }
    };

    const getAddressLine2 = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setAddressLine2(event.target.value);
    };

    const getAddressTown = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setAddressTown(event.target.value);
    };

    const getAddressCounty = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setAddressCounty(event.target.value);
    };

    const getAddressPostcode = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.target.value;
        const postcodePattern =
            /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;
        if (input === "") {
            setErrorMessages({
                ...errorMessages,
                postcodeErrorMessage: "This is a required field",
            });
        } else if (input.match(postcodePattern)) {
            setErrorMessages({ ...errorMessages, postcodeErrorMessage: "" });
            const formattedPostcode = input.replace(/(\s)/g, "").toUpperCase();
            setAddressPostcode(formattedPostcode);
        } else {
            setErrorMessages({
                ...errorMessages,
                postcodeErrorMessage: "Please enter a valid postcode.",
            });
        }
    };

    const getNumberAdults = (
        event: React.ChangeEvent<HTMLInputElement>,
        gender: PersonType
    ): void => {
        const input = event.target.value;
        const numberPattern = /^\d+$/;
        if (input === "") {
            numberAdults[gender] = 0;
        } else if (input.match(numberPattern)) {
            numberAdults[gender] = parseInt(input);
        } else {
            numberAdults[gender] = -1;
        }
        setNumberAdults(numberAdults);
        const nonZeroAdultEntry = Object.values(numberAdults).filter((value) => value > 0);
        const invalidAdultEntry = Object.values(numberAdults).filter((value) => value === -1);
        if (invalidAdultEntry.length > 0) {
            setErrorMessages({
                ...errorMessages,
                numberAdultsErrorMessage: "Please enter a valid number.",
            });
        } else if (nonZeroAdultEntry.length === 0) {
            setErrorMessages({
                ...errorMessages,
                numberAdultsErrorMessage: "This is a required field.",
            });
        } else {
            setErrorMessages({
                ...errorMessages,
                numberAdultsErrorMessage: "",
            });
        }
    };

    const getNumberChildren = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.target.value;

        if (input === "") {
            setErrorMessages({ ...errorMessages, numberChildrenErrorMessage: "" });
        } else if (input.match(/^\d+$/)) {
            setErrorMessages({ ...errorMessages, numberChildrenErrorMessage: "" });
            setNumberChildren(parseInt(input));
        } else {
            setErrorMessages({
                ...errorMessages,
                numberChildrenErrorMessage: "Please enter a valid number",
            });
        }
    };

    const getGenderChildren = (event: SelectChangeEvent, count: number): void => {
        const input = event.target.value !== "don't know" ? event.target.value : "child";
        const particularChild = ageGenderChildren.findIndex((object) => object.key === count);
        ageGenderChildren[particularChild].gender = input as PersonType; // TODO: Casting is dodgy
        setAgeGenderChildren([...ageGenderChildren]);
    };

    const getAgeChildren = (event: SelectChangeEvent, count: number): void => {
        const input = event.target.value;
        const particularChild = ageGenderChildren.findIndex((object) => object.key === count);
        ageGenderChildren[particularChild].age = input !== "Don't Know" ? parseInt(input) : null;
        setAgeGenderChildren([...ageGenderChildren]);
    };

    const getBabyProducts = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.target.value;
        if (input === "Yes") {
            setErrorMessages({ ...errorMessages, nappyErrorMessage: "N/A" });
            setBabyProducts(true);
        } else if (input === "No") {
            setErrorMessages({ ...errorMessages, nappyErrorMessage: "" });
            setBabyProducts(false);
        } else {
            setErrorMessages({ ...errorMessages, nappyErrorMessage: "" });
            setBabyProducts(null);
        }
    };

    const getNappySize = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.target.value;
        if (input === "") {
            setErrorMessages({ ...errorMessages, nappyErrorMessage: "This is a required field" });
        } else {
            setErrorMessages({ ...errorMessages, nappyErrorMessage: "" });
            setNappySize(input);
        }
    };

    // TODO: Change this disgusting code
    const getFieldWithoutChecks = (
        fieldSetter: any
    ): ((event: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (event) => fieldSetter(event.target.value);
    };

    const getPetFood = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPetFood(event.target.value);
    };

    const getDeliveryInstructions = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setDeliveryInstruction(event.target.value);
    };

    const getExtraInformation = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setExtraInformation(event.target.value);
    };

    const checkboxGroupToArray = (checkedBoxes: booleanGroup): string[] => {
        return Object.keys(checkedBoxes);
    };

    const createRecord = async (): Promise<void> => {
        if (nappySize) {
            setExtraInformation(`Nappy Size: ${nappySize}, Extra Information: ${extraInformation}`);
        }

        const clientRecord: ClientDatabaseRecord = {
            address_1: addressLine1,
            address_2: addressLine2,
            address_county: addressCounty,
            address_postcode: addressPostcode,
            address_town: addressTown,
            baby_food: babyProducts,
            delivery_instructions: deliveryInstructions,
            dietary_requirements: checkboxGroupToArray(dietaryRequirements),
            feminine_products: checkboxGroupToArray(feminineProducts),
            full_name: fullName,
            other_items: checkboxGroupToArray(otherItems),
            pet_food: checkboxGroupToArray(petFood),
            phone_number: phoneNumber,
            extra_information: extraInformation,
        };
        const { data: familyID, error: error } = await supabase
            .from("clients")
            .insert(clientRecord)
            .select("family_id");
        if (error) {
            console.error(error);
        }

        for (const [gender, quantity] of Object.entries(numberAdults)) {
            const familyAdultRecord: FamilyDatabaseRecord = {
                family_id: familyID![0].family_id,
                person_type: gender as PersonType, // TODO: Casting is dodgy
                quantity: quantity,
                age: null,
            };
            const { error: error } = await supabase.from("families").insert(familyAdultRecord);
            if (error) {
                console.error(error);
            }
        }

        for (const child of ageGenderChildren) {
            const familyChildRecord: FamilyDatabaseRecord = {
                family_id: familyID![0].family_id,
                person_type: child.gender as PersonType,
                quantity: 1,
                age: child.age,
            };
            const { error: error } = await supabase.from("families").insert(familyChildRecord);
            if (error) {
                console.error(error);
            }
        }
    };

    const submitForm = (): void => {
        let errorExists = false;
        let amendedErrorMessages = { ...errorMessages };
        for (const [errorKey, errorMessage] of Object.entries(errorMessages)) {
            if (errorMessage !== "") {
                errorExists = true;
            }
            if (errorMessage === "N/A") {
                amendedErrorMessages = {
                    ...amendedErrorMessages,
                    [errorKey]: "This is a required field.",
                };
            }
        }
        setErrorMessages({ ...amendedErrorMessages });
        if (errorExists) {
            alert("Please ensure all fields have been entered correctly.");
        } else {
            void createRecord();
        }
    };

    const childrenLoopArray: number[] = Array.from(
        { length: numberChildren },
        (value, index) => index
    );

    const errorColor = (errorMessage: string): boolean => {
        return errorMessage !== "" && errorMessage !== "N/A";
    };

    const errorText = (errorMessage: string): string => {
        return errorMessage == "N/A" ? "" : errorMessage;
    };

    return (
        <CenterComponent>
            <StyledForm>
                <Heading>Client Form</Heading>
                <Text>
                    Please provide or update the client&apos;s personal details, household
                    composition, dietary restrictions and other needs.
                </Text>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>
                            Client Full Name <Asterisk>*</Asterisk>
                        </Subheading>
                        <Text>First and last name</Text>
                        <FreeFormTextInput
                            error={errorColor(errorMessages.nameErrorMessage)}
                            helperText={errorText(errorMessages.nameErrorMessage)}
                            label="Name"
                            onChange={getFullName}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>Phone Number</Subheading>
                        <Text>
                            UK mobile numbers should start with a 0 or a +44. International mobile
                            numbers should be entered with the country code.
                        </Text>
                        <FreeFormTextInput
                            error={!!errorMessages.phoneErrorMessage}
                            helperText={errorMessages.phoneErrorMessage}
                            label="E.g. 0xxx-xx-xxxx or +44 xxxx xxx xxxx"
                            onChange={getPhoneNumber}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>
                            Address Line 1 <Asterisk>*</Asterisk>{" "}
                        </Subheading>
                        <Text>Please enter the flat/house number if applicable.</Text>
                        <FreeFormTextInput
                            error={errorColor(errorMessages.addressErrorMessage)}
                            helperText={errorText(errorMessages.addressErrorMessage)}
                            label="Address Line 1"
                            onChange={getAddressLine1}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>Address Line 2</Subheading>
                        <FreeFormTextInput label="Address Line 2" onChange={getAddressLine2} />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>Town</Subheading>
                        <FreeFormTextInput label="Town" onChange={getAddressTown} />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>County</Subheading>
                        <FreeFormTextInput label="County" onChange={getAddressCounty()} />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>
                            Postcode <Asterisk>*</Asterisk>
                        </Subheading>
                        <FreeFormTextInput
                            error={errorColor(errorMessages.postcodeErrorMessage)}
                            helperText={errorText(errorMessages.postcodeErrorMessage)}
                            label="E.g. SE11 5QY"
                            onChange={getAddressPostcode}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>
                            Number of Adults <Asterisk>*</Asterisk>
                        </Subheading>
                        <Text>Note that adults are aged 16 or above</Text>
                        <FreeFormTextInput
                            error={errorColor(errorMessages.numberAdultsErrorMessage)}
                            label="Female"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                getNumberAdults(event, "female")
                            }
                        />
                        <FreeFormTextInput
                            error={errorColor(errorMessages.numberAdultsErrorMessage)}
                            label="Male"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                getNumberAdults(event, "male")
                            }
                        />
                        <FreeFormTextInput
                            error={errorColor(errorMessages.numberAdultsErrorMessage)}
                            helperText={errorText(errorMessages.numberAdultsErrorMessage)}
                            label="Prefer Not To Say"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                getNumberAdults(event, "adult")
                            }
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>
                            Number of Children <Asterisk>*</Asterisk>
                        </Subheading>
                        <Text>Note that children are under 16 years old</Text>
                        <FreeFormTextInput
                            error={errorColor(errorMessages.numberChildrenErrorMessage)}
                            helperText={errorText(errorMessages.numberChildrenErrorMessage)}
                            label="Number of Children"
                            onChange={getNumberChildren}
                        />
                    </StyledCard>
                </CenterComponent>
                {childrenLoopArray.map((count) => {
                    return (
                        <CenterComponent key={count}>
                            <StyledCard>
                                <Subheading>Child {count + 1}</Subheading>
                                <CenterComponent>
                                    <DropdownListInput
                                        labelsAndValues={[
                                            ["Boy", "boy"],
                                            ["Girl", "girl"],
                                            ["Prefer Not To Say", "child"],
                                            ["Don't Know", "don't know"],
                                        ]}
                                        listTitle="Gender"
                                        defaultValue="don't know"
                                        onChange={(event: SelectChangeEvent) =>
                                            getGenderChildren(event, count)
                                        }
                                    />
                                </CenterComponent>
                                <CenterComponent>
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
                                            ["16", "16"],
                                            ["Don't Know", "Don't Know"],
                                        ]}
                                        listTitle="Age"
                                        defaultValue="Don't Know"
                                        onChange={(event: SelectChangeEvent) =>
                                            getAgeChildren(event, count)
                                        }
                                    />
                                </CenterComponent>
                            </StyledCard>
                        </CenterComponent>
                    );
                })}
                <CenterComponent>
                    <StyledCard>
                        <Subheading>Dietary Requirements</Subheading>
                        <Text>Tick all that apply.</Text>
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
                            onChange={getCheckboxGroupHandler(
                                dietaryRequirements,
                                setDietaryRequirements
                            )}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>Feminine Products</Subheading>
                        <CheckboxGroupInput
                            labelsAndKeys={[
                                ["Tampons", "Tampons"],
                                ["Pads", "Pads"],
                                ["Incontinence Pads", "Incontinence Pads"],
                            ]}
                            onChange={getCheckboxGroupHandler(
                                feminineProducts,
                                setFeminineProducts
                            )}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>
                            Baby Products <Asterisk>*</Asterisk>
                        </Subheading>
                        <Text>Includes Baby Food, Wet Wipes, Nappies etc.</Text>
                        <RadioGroupInput
                            labelsAndValues={[
                                ["Yes", "Yes"],
                                ["No", "No"],
                                ["Don't Know", "don't know"],
                            ]}
                            defaultValue="don't know"
                            onChange={getBabyProducts}
                        />
                        {babyProducts ? (
                            <>
                                <br />
                                <FreeFormTextInput
                                    error={
                                        !!errorMessages.nappyErrorMessage &&
                                        errorMessages.nappyErrorMessage !== "N/A"
                                    }
                                    helperText={errorMessages.nappyErrorMessage}
                                    label="Nappy Size"
                                    onChange={getNappySize}
                                />
                            </>
                        ) : (
                            <></>
                        )}
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>Pet Food</Subheading>
                        <Text>
                            Tick all that apply. Specify any other requests in the &quot;Extra
                            Information&quot; section.
                        </Text>
                        <CheckboxGroupInput
                            labelsAndKeys={[
                                ["Cat", "Cat"],
                                ["Dog", "Dog"],
                            ]}
                            onChange={getPetFood}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>Other Items</Subheading>
                        <CheckboxGroupInput
                            labelsAndKeys={[
                                ["Garlic", "Garlic"],
                                ["Ginger", "Ginger"],
                                ["Chilies", "Chilies"],
                                ["Spices", "Spices"],
                                ["Hot Water Bottles", "Hot Water Bottles"],
                                ["Blankets", "Blankets"],
                            ]}
                            onChange={getCheckboxGroupHandler(otherItems, setOtherItems)}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>Delivery Instructions</Subheading>
                        <Text>
                            Is there anything we need to know when delivering a parcel to this
                            client? Does the doorbell work? Do we need to phone them? Is there a
                            door code? Do they live upstairs in a flat and cannot come downstairs?
                        </Text>
                        <FreeFormTextInput
                            label="Delivery Instructions"
                            onChange={getDeliveryInstructions}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard>
                        <Subheading>Extra Information</Subheading>
                        <Text>
                            Is there anything else you need to tell us about the client? Comments
                            relating to food or anything else. Please add any delivery instructions
                            to the &quot;Delivery Instructions&quot; section above.
                        </Text>
                        <FreeFormTextInput
                            label="E.g. tea allergy"
                            onChange={getExtraInformation}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledButton type="submit" onClick={submitForm}>
                        Submit
                    </StyledButton>
                </CenterComponent>
            </StyledForm>
        </CenterComponent>
    );
};

export default RequestForm;

/*
TODO: All of this.


7. Add extra functionalities to the form.
    - Autofill (editing vs creating) -> URL with primary ID 
    - Send a copy of the form to their email / show on their dashboard.
    - Word limits.
8. Refactor code (components instead of copy and paste)
9. Write tests

***********************************
DONE

1. Try out all individual components and learn how they can be used.
    - Technical Review
2. Make 1 test-case for each component and make sure all the basic functionalities work.
    - Shows on page.
    - Data can be inputted.
    - Data can be submitted.
    - Data can be stored (e.g. console log)
3. Create the full form by repeating (2) and replacing placeholder texts.
4. Add styles to the full form.
    - Use Themes (especially for error messages) once it has been merged.
5. Connect the form to the database (INSERT).
    - Families
    - Client
6. Add secondary functionalities to the form.
    - Validation of inputs.
    - Required.


*/
