import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    errorExists,
    errorText,
    numberRegex,
    Person,
    Gender,
    onChangeText,
} from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { SelectChangeEventHandler } from "@/components/DataInput/inputHandlerFactories";
import { FormText, StyledCard } from "@/components/Form/formStyling";
import { ClientCardProps, ClientSetter } from "../ClientForm";
import { UncontrolledSelect } from "@/components/DataInput/DropDownSelect";
import { getAdultBirthYears } from "@/app/clients/form/birthYearDropdown";

const MINIMUM_NUMBER_OF_ADULTS = 1;
const MAXIMUM_NUMBER_OF_ADULTS = 20;

const numberOfAdultsRange = (value: string): boolean => {
    return (
        parseInt(value) <= MAXIMUM_NUMBER_OF_ADULTS && parseInt(value) >= MINIMUM_NUMBER_OF_ADULTS
    );
};

const setAdultsFields = (
    fieldSetter: ClientSetter,
    adults: Person[],
    index: number,
    subFieldName: "gender" | "birthYear"
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        switch (subFieldName) {
            case "gender":
                adults[index][subFieldName] = (input !== "Don't Know" ? input : "other") as Gender;
                break;
            case "birthYear":
                adults[index][subFieldName] = parseInt(input);
                break;
        }
        fieldSetter({ adults: [...adults] });
    };
};

const NumberAdultsCard: React.FC<ClientCardProps> = ({
    formErrors,
    errorSetter,
    fieldSetter,
    fields,
}) => {
    return (
        <GenericFormCard
            title="Number of Adults"
            required={true}
            text="Please enter a number between 1 and 20. (Note that adults are aged 16 or above)."
        >
            <>
                <FreeFormTextInput
                    id="client-number-adults"
                    label="Number of Adults"
                    defaultValue={
                        fields.numberOfAdults !== 0 ? fields.numberOfAdults.toString() : undefined
                    }
                    error={errorExists(formErrors.numberOfAdults)}
                    helperText={errorText(formErrors.numberOfAdults)}
                    onChange={onChangeText(
                        fieldSetter,
                        errorSetter,
                        "numberOfAdults",
                        true,
                        numberRegex,
                        parseInt,
                        numberOfAdultsRange
                    )}
                />
                {fields.adults.map((adult: Person, index: number) => {
                    return (
                        <StyledCard key={adult.primaryKey}>
                            <FormText>Adult {index + 1}</FormText>
                            <UncontrolledSelect
                                selectLabelId="adult-gender-select-label"
                                labelsAndValues={[
                                    ["Male", "male"],
                                    ["Female", "female"],
                                    ["Prefer Not To Say", "other"],
                                ]}
                                listTitle="Gender"
                                defaultValue={adult.gender}
                                onChange={setAdultsFields(
                                    fieldSetter,
                                    fields.adults,
                                    index,
                                    "gender"
                                )}
                            />
                            <UncontrolledSelect
                                selectLabelId="adult-birth-year-select-label"
                                labelsAndValues={getAdultBirthYears().map((year) => [
                                    `${year}`,
                                    `${year}`,
                                ])}
                                listTitle="Year of Birth"
                                defaultValue={adult.birthYear.toString()}
                                onChange={setAdultsFields(
                                    fieldSetter,
                                    fields.adults,
                                    index,
                                    "birthYear"
                                )}
                            />
                        </StyledCard>
                    );
                })}
            </>
        </GenericFormCard>
    );
};

export default NumberAdultsCard;
