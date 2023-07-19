"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import RadioGroupInput from "@/components/DataInput/RadioGroupInput";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { SelectChangeEvent, Paper, Card } from "@mui/material";
import supabase, { InsertSchema } from "@/supabase";

type DatabaseRecord = InsertSchema["clients"];

interface ChildProps {
    key: number;
    gender?: string;
    age?: number;
}

const CenterComponent = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    padding-block: 2rem;
`;

// TODO: rounded corners, disappearing scroll bar
const StyledForm = styled(Paper)`
    display: flex;
    flex-direction: column;
    width: min(50%, 600px);
    height: min(50%, 800px);
    padding: 2em 2em;
    max-height: 1000px; // TODO: Make responsive.
    overflow: auto; // TODO: Instead of scrollable, have a Next button.
    color: ${(props) => props.theme.primaryBackgroundColor}; // TODO: Doesn't change anything
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

const StyledButton = styled.button`
    text-align: center;
    width: 20%;
`;

const RequestForm: React.FC<{}> = () => {
    // TODO: Check if the initialState of these consts make sense
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [addressTown, setAddressTown] = useState("");
    const [addressCounty, setAddressCounty] = useState("");
    const [addressPostcode, setAddressPostcode] = useState("");
    const [gender, setGender] = useState("");
    const [householdSize, setHouseholdSize] = useState("");
    const [numberAdults, setNumberAdults] = useState(0);
    const [numberChildren, setNumberChildren] = useState(0);
    const [ageGenderChildren, setAgeGenderChildren] = useState<ChildProps[]>([]);
    const [babyProducts, setBabyProducts] = useState("");
    const [deliveryInstructions, setDeliveryInstruction] = useState("");
    const [feminineProducts, setFeminineProducts] = useState("");
    const [petFood, setPetFood] = useState("");
    const [otherRequirements, setOtherRequirements] = useState("");
    const [dietaryRequirements, setDietaryRequirements] = useState("");

    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
    const [addressErrorMessage, setAddressErrorMessage] = useState("");
    const [postcodeErrorMessage, setPostcodeErrorMessage] = useState("");
    const [numberAdultsErrorMessage, setNumberAdultsErrorMessage] = useState("");
    const [numberChildrenErrorMessage, setNumberChildrenErrorMessage] = useState("");

    useEffect(() => {
        // TODO: Error message for "required"
        const array = Array.from({ length: numberChildren }, (value, index): ChildProps => {
            return {
                key: index,
                gender: "P",
                age: 0,
            };
        });
        setAgeGenderChildren(array);
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
            // TODO: if regex valid checkthrough https://postcodes.io/
            setAddressPostcode(formattedPostcode);
        } else {
            setPostcodeErrorMessage("Please enter a valid postcode");
        }
    };

    const getGender = (event: React.ChangeEvent<HTMLInputElement>): void => {
        // TODO: Other (If chosen, have a textInput box pop up)
        // const gender = event.target.value;
        // if (gender === "O") {
        //     return <StyledTextInput label={"Other"} onChange={getGender}></StyledTextInput>
        // }
        setGender(event.target.value);
    };

    const getHouseholdSize = (event: SelectChangeEvent): void => {
        setHouseholdSize(event.target.value);
    };

    const getNumberAdults = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.target.value;
        if (input.match(/^\d+$/)) {
            setNumberAdultsErrorMessage("");
            setNumberAdults(parseInt(input));
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
        const input = event.target.value;
        const particularChild = ageGenderChildren.findIndex((object) => object.key === count);
        ageGenderChildren[particularChild].gender = input;
        setAgeGenderChildren([...ageGenderChildren]);
    };

    const getAgeChildren = (event: SelectChangeEvent, count: number): void => {
        const input = parseInt(event.target.value);
        const particularChild = ageGenderChildren.findIndex((object) => object.key === count);
        ageGenderChildren[particularChild].age = input;
        setAgeGenderChildren([...ageGenderChildren]);
    };

    const getBabyProducts = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setBabyProducts(event.target.value);
    };

    const getPetFood = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPetFood(event.target.value);
    };

    const createRecord = async (): Promise<void> => {
        const record: DatabaseRecord = {
            address_1: addressLine1,
            address_2: addressLine2,
            address_county: addressCounty,
            address_postcode: addressPostcode,
            address_town: addressTown,
            baby_food: babyProducts,
            delivery_instructions: deliveryInstructions,
            dietary_requirements: dietaryRequirements,
            feminine_products: feminineProducts,
            full_name: fullName,
            other_requirements: otherRequirements,
            pet_food: petFood,
            phone_number: phoneNumber,
        };
        const { data, error } = await supabase.from("clients").insert(record).select();
        // TODO: This .select() is to fetch the data for testing purposes. Can be removed.
        if (error) {
            console.log(error); // TODO: change this to either throw an error, or console.error
        } else {
            console.log(JSON.stringify(data)); // TODO: remove this bit
        }
    };

    const submitForm = (): void => {
        createRecord();
    };

    const childrenLoopArray: number[] = Array.from(
        { length: numberChildren },
        (value, index) => index
    );

    console.log(ageGenderChildren);

    // TODO: Change description text (accordingly to how validation is implemented
    // TODO: Implement the check boxes once it is merged into main
    return (
        <CenterComponent>
            <StyledForm elevation={4}>
                <Heading>Request Client Form</Heading>
                <Text>Some descriptive and informative text about the form.</Text>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Client Full Name <Asterisk>*</Asterisk>
                        </Subheading>
                        <Text>First and last name</Text>
                        <StyledTextInput
                            error={nameErrorMessage !== ""}
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
                            UK mobile numbers should start with a 0. International mobile numbers
                            should be entered with the dialing code.
                        </Text>
                        <StyledTextInput
                            error={phoneErrorMessage !== ""}
                            helperText={phoneErrorMessage}
                            label="E.g. 07### or 33###"
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
                            error={addressErrorMessage !== ""}
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
                        <Text>Check the address using the Royal Mail Address Checker</Text>
                        <StyledTextInput
                            error={postcodeErrorMessage !== ""}
                            helperText={postcodeErrorMessage}
                            label="E.g. SE11 5QY"
                            onChange={getAddressPostcode}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Gender <Asterisk>*</Asterisk>
                        </Subheading>
                        <StyledRadioGroup
                            labelsAndValues={[
                                ["Male", "M"],
                                ["Female", "F"],
                                ["Prefer Not To Say", "P"],
                                ["Don't Know", "D"],
                                ["Other", "O"],
                            ]}
                            onChange={getGender}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Household Size <Asterisk>*</Asterisk>
                        </Subheading>
                        <StyledDropDown
                            labelsAndValues={[
                                ["1", "1"],
                                ["2", "2"],
                                ["3", "3"],
                                ["4", "4"],
                                ["5", "5"],
                                ["6", "6"],
                                ["7", "7"],
                                ["8", "8"],
                                ["9", "9"],
                                ["10+", "10+"],
                            ]}
                            listTitle="Choose"
                            defaultValue="1"
                            onChange={getHouseholdSize}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Number of Adults <Asterisk>*</Asterisk>
                        </Subheading>
                        <Text>How many adults over 16 are there in the household?</Text>
                        <StyledTextInput
                            error={numberAdultsErrorMessage !== ""}
                            helperText={numberAdultsErrorMessage}
                            label="Number of Adults"
                            onChange={getNumberAdults}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>Number of Children</Subheading>
                        <Text>
                            How many children under the age of 16 are there in the household? Leave
                            blank if not applicable.
                        </Text>
                        <StyledTextInput
                            error={numberChildrenErrorMessage !== ""}
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
                                            ["Boy", "B"],
                                            ["Girl", "G"],
                                            ["Prefer Not To Say", "P"],
                                        ]}
                                        listTitle="Gender"
                                        defaultValue="P"
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
                                        ]}
                                        listTitle="Age"
                                        defaultValue="0"
                                        onChange={(event: SelectChangeEvent) =>
                                            getAgeChildren(event, count)
                                        }
                                    />
                                </CenterComponent>
                            </StyledCard>
                        </CenterComponent>
                    );
                })}
                {/*<CenterComponent>*/}
                {/*    <StyledCard variant="outlined">*/}
                {/*        <Subheading>Age and Gender of Children</Subheading>*/}
                {/*        <Text>Leave blank if not applicable.</Text>*/}
                {/*        <StyledTextInput*/}
                {/*            error={ageGenderErrorMessage !== ""}*/}
                {/*            helperText={ageGenderErrorMessage}*/}
                {/*            label="E.g. G-7, B-10, C-13"*/}
                {/*            onChange={getAgeGenderChildren}*/}
                {/*        />*/}
                {/*    </StyledCard>*/}
                {/*</CenterComponent>*/}
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Dietary Requirements <Asterisk>*</Asterisk>
                        </Subheading>
                        <Text>Tick all that apply.</Text>
                        {/* Wait for Check Box Merge */}
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Feminine Products <Asterisk>*</Asterisk>
                        </Subheading>
                        {/* Wait for Check Box Merge */}
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Baby Products <Asterisk>*</Asterisk>
                        </Subheading>
                        <Text>
                            Includes Baby Food, Wet Wipes, Nappies etc. Write the baby nappy size in
                            the comments.
                        </Text>
                        <StyledRadioGroup
                            labelsAndValues={[
                                ["Yes", "Y"],
                                ["No", "N"],
                                ["Don't Know", "D"],
                            ]}
                            onChange={getBabyProducts}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>
                            Pet Food Required? <Asterisk>*</Asterisk>
                        </Subheading>
                        <StyledRadioGroup
                            labelsAndValues={[
                                ["Yes - Cat", "YC"],
                                ["Yes - Dog", "YD"],
                                ["Yes - Cat & Dog", "YCD"],
                                ["No", "N"],
                                ["Don't Know", "D"],
                            ]}
                            onChange={getPetFood}
                        />
                    </StyledCard>
                </CenterComponent>
                <CenterComponent>
                    <StyledCard variant="outlined">
                        <Subheading>Other Requirements</Subheading>
                        {/* Wait for Check Box Merge */}
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
    - Autofill.
7. Add extra functionalities to the form.
    - Submit using keypress instead of buttons.
    - Send a copy of the form to their email / show on their dashboard.
    - Save progress.
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

Validation of inputs.
Required.


*/
