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
import { SelectChangeEvent, Card } from "@mui/material";
import supabase, { InsertSchema } from "@/supabase";
import { Database } from "@/database_types_file";

type ClientDatabaseRecord = InsertSchema["clients"];
type FamilyDatabaseRecord = InsertSchema["families"];
type PersonType = Database["public"]["Enums"]["gender"];

interface ChildProps {
    key: number;
    gender: PersonType;
    age: number | null;
}

const CenterComponent = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    padding-block: 2rem;
`;

const StyledForm = styled.div`
    margin: 2em;
    color: ${(props) => props.theme.foregroundColor};
`;

const StyledCard = styled(Card)`
    padding: 2em 2em;
    width: 100%;
    height: 80%;
    border-radius: 1px;
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

const StyledTextInput = styled(FreeFormTextInput)``;

const StyledRadioGroup = styled(RadioGroupInput)``;

const StyledDropDown = styled(DropdownListInput)``;

const StyledCheckBox = styled(CheckboxGroupInput)``;

const StyledButton = styled.button`
    text-align: center;
    width: 20%;
    aspect-ratio: 5;
    border-radius: 10px;
    border: solid 1px ${(props) => props.theme.foregroundColor};
    background-color: ${(props) => props.theme.primaryBackgroundColor};
    color: ${(props) => props.theme.primaryForegroundColor};

    &:hover {
        background-color: ${(props) => props.theme.secondaryBackgroundColor};
        color: ${(props) => props.theme.secondaryForegroundColor};
    }
`;

type GenderToAge = {
    [gender in PersonType]?: number;
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

    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
    const [addressErrorMessage, setAddressErrorMessage] = useState("");
    const [postcodeErrorMessage, setPostcodeErrorMessage] = useState("");
    const [numberAdultsErrorMessage, setNumberAdultsErrorMessage] = useState("");
    const [numberChildrenErrorMessage, setNumberChildrenErrorMessage] = useState("");
    const [nappyErrorMessage, setNappyErrorMessage] = useState("");

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
            setNameErrorMessage("This is a required field");
        } else {
            setNameErrorMessage("");
            setFullName(event.target.value);
        }
    };

    const getPhoneNumber = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const phoneNumberPattern = /^(\+|0)(\s?)(\s|\d+|-){5,}$/;
        const input = event.target.value;
        if (input === "" || input.match(phoneNumberPattern)) {
            setPhoneErrorMessage("");
        } else {
            setPhoneErrorMessage("Please enter a valid phone number");
        }
        const numericInput = input.replace(/(\D)/g, "");
        const formattedNumber =
            numericInput[0] === "0" ? "+44" + numericInput.slice(1) : "+" + numericInput;
        setPhoneNumber(formattedNumber);
    };

    const getAddressLine1 = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.target.value;
        if (input === "") {
            setAddressErrorMessage("This is a required field");
        } else {
            setAddressErrorMessage("");
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
            setPostcodeErrorMessage("This is a required field.");
        } else if (input.match(postcodePattern)) {
            setPostcodeErrorMessage("");
            const formattedPostcode = input.replace(/(\s)/g, "").toUpperCase();
            setAddressPostcode(formattedPostcode);
        } else {
            setPostcodeErrorMessage("Please enter a valid postcode");
        }
    };

    const getNumberAdults = (
        event: React.ChangeEvent<HTMLInputElement>,
        gender: PersonType
    ): void => {
        const input = event.target.value;
        if (input.match(/^\d+$/)) {
            setNumberAdultsErrorMessage("");
            numberAdults[gender] = parseInt(input);
            setNumberAdults(numberAdults);
        } else if (input === "") {
            setNumberAdultsErrorMessage("This is a required field.");
        } else {
            setNumberAdultsErrorMessage("Invalid number");
        }
    };

    const getNumberChildren = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.target.value;

        if (input === "") {
            setNumberChildrenErrorMessage("");
        } else if (input.match(/^\d+$/)) {
            setNumberChildrenErrorMessage("");
            setNumberChildren(parseInt(input));
        } else {
            setNumberChildrenErrorMessage("Invalid number");
        }
    };

    const getGenderChildren = (event: SelectChangeEvent, count: number): void => {
        const input = event.target.value as PersonType; // TODO: Casting is dodgy
        const particularChild = ageGenderChildren.findIndex((object) => object.key === count);
        ageGenderChildren[particularChild].gender = input;
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
            setBabyProducts(true);
        } else if (input === "No") {
            setBabyProducts(false);
        } else {
            setBabyProducts(null);
        }
    };

    const getNappySize = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.target.value;
        if (input === "") {
            setNappyErrorMessage("This is a required field");
        } else {
            setNappyErrorMessage("");
            setNappySize(input);
        }
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
        setExtraInformation(`Nappy Size: ${nappySize}, Extra Information: ${extraInformation}`);

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
        void createRecord();
    };

    const childrenLoopArray: number[] = Array.from(
        { length: numberChildren },
        (value, index) => index
    );

    return (
        <CenterComponent>
            <StyledForm>
                <Heading>Client Form</Heading>
                <Text>
                    Please provide or update the client&apos;s personal details, household
                    composition, dietary restrictions and other needs.
                </Text>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Client Full Name <Asterisk>*</Asterisk>
                        </Subheading>
                        <Text>First and last name</Text>
                        <StyledTextInput
                            error={!!nameErrorMessage}
                            helperText={nameErrorMessage}
                            label="Name"
                            onChange={getFullName}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>Phone Number</Subheading>
                        <Text>
                            UK mobile numbers should start with a 0 or a +44. International mobile
                            numbers should be entered with the country code.
                        </Text>
                        <StyledTextInput
                            error={!!phoneErrorMessage}
                            helperText={phoneErrorMessage}
                            label="E.g. 07### or +33###"
                            onChange={getPhoneNumber}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Address Line 1 <Asterisk>*</Asterisk>{" "}
                        </Subheading>
                        <Text>Please enter the flat/house number if applicable.</Text>
                        <StyledTextInput
                            error={!!addressErrorMessage}
                            helperText={addressErrorMessage}
                            label="Address Line 1"
                            onChange={getAddressLine1}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>Address Line 2</Subheading>
                        <StyledTextInput label="Address Line 2" onChange={getAddressLine2} />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>Town</Subheading>
                        <StyledTextInput label="Town" onChange={getAddressTown} />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>County</Subheading>
                        <StyledTextInput label="County" onChange={getAddressCounty} />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Postcode <Asterisk>*</Asterisk>
                        </Subheading>
                        <StyledTextInput
                            error={!!postcodeErrorMessage}
                            helperText={postcodeErrorMessage}
                            label="E.g. SE11 5QY"
                            onChange={getAddressPostcode}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Number of Adults <Asterisk>*</Asterisk>
                        </Subheading>
                        <Text>Note that adults are aged 16 or above</Text>
                        <StyledTextInput
                            error={!!numberAdultsErrorMessage}
                            helperText={numberAdultsErrorMessage}
                            label="Female"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                getNumberAdults(event, "female")
                            }
                        />
                        <StyledTextInput
                            error={!!numberAdultsErrorMessage}
                            helperText={numberAdultsErrorMessage}
                            label="Male"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                getNumberAdults(event, "male")
                            }
                        />
                        <StyledTextInput
                            error={!!numberAdultsErrorMessage}
                            helperText={numberAdultsErrorMessage}
                            label="Prefer Not To Say"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                getNumberAdults(event, "adult")
                            }
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>Number of Children</Subheading>
                        <Text>Note that children are under 16 years old</Text>
                        <StyledTextInput
                            error={!!numberChildrenErrorMessage}
                            helperText={numberChildrenErrorMessage}
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
                                    <StyledDropDown
                                        labelsAndValues={[
                                            ["Boy", "boy"],
                                            ["Girl", "girl"],
                                            ["Prefer Not To Say", "child"],
                                            ["Don't Know", "child"],
                                        ]}
                                        listTitle="Gender"
                                        defaultValue="child"
                                        onChange={(event: SelectChangeEvent) =>
                                            getGenderChildren(event, count)
                                        }
                                    />
                                </CenterComponent>
                                <CenterComponent>
                                    <StyledDropDown
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
                    <StyledCard variant="outlined">
                        <Subheading>Dietary Requirements</Subheading>
                        <Text>Tick all that apply.</Text>
                        <StyledCheckBox
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
                    <StyledCard variant="outlined">
                        <Subheading>Feminine Products</Subheading>
                        <StyledCheckBox
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
                    <StyledCard variant="outlined">
                        <Subheading>
                            Baby Products <Asterisk>*</Asterisk>
                        </Subheading>
                        <Text>Includes Baby Food, Wet Wipes, Nappies etc.</Text>
                        <StyledRadioGroup
                            labelsAndValues={[
                                ["Yes", "Yes"],
                                ["No", "No"],
                                ["Don't Know", "don't know"],
                            ]}
                            onChange={getBabyProducts}
                        />
                        {babyProducts ? (
                            <>
                                <br />
                                <StyledTextInput
                                    error={!!nappyErrorMessage}
                                    helperText={nappyErrorMessage}
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
                    <StyledCard variant="outlined">
                        <Subheading>Pet Food</Subheading>
                        <Text>
                            Tick all that apply. Specify any other requests in the &quot;Extra
                            Information&quot; section.
                        </Text>
                        <StyledCheckBox
                            labelsAndKeys={[
                                ["Cat", "Cat"],
                                ["Dog", "Dog"],
                            ]}
                            onChange={getPetFood}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>Other Items</Subheading>
                        <StyledCheckBox
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
                    <StyledCard variant="outlined">
                        <Subheading>Delivery Instructions</Subheading>
                        <Text>
                            Is there anything we need to know when delivering a parcel to this
                            client? Does the doorbell work? Do we need to phone them? Is there a
                            door code? Do they live upstairs in a flat and cannot come downstairs?
                        </Text>
                        <StyledTextInput
                            label="Delivery Instructions"
                            onChange={getDeliveryInstructions}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>Extra Information</Subheading>
                        <Text>
                            Is there anything else you need to tell us about the client? Comments
                            relating to food or anything else. Please add any delivery instructions
                            to the &quot;Delivery Instructions&quot; section above.
                        </Text>
                        <StyledTextInput label="E.g. tea allergy" onChange={getExtraInformation} />
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

// TODO: Final check for all data when submit button is clicked.

/*
TODO: All of this.


4. Add styles to the full form.
    - Use Themes (especially for error messages) once it has been merged.
6. Add secondary functionalities to the form.
    - Autofill (editing vs creating) -> URL with primary ID 
7. Add extra functionalities to the form.
    - Submit using keypress instead of buttons.
    - Submit checks required boxes.
    - Send a copy of the form to their email / show on their dashboard.
    - Save progress.
    - Word limits.
    - MUI textarea instead of input
8. Refactor code (components instead of copy and paste)

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
5. Connect the form to the database (INSERT).
    - Families
    - Client
6. Add secondary functionalities to the form.
    - Validation of inputs.
    - Required.


*/
