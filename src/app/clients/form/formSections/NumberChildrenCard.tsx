import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    errorExists,
    errorText,
    onChangeText,
    numberRegex,
    Person,
    Gender,
} from "@/components/Form/formFunctions";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { StyledCard, FormText } from "@/components/Form/formStyling";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { SelectChangeEventHandler } from "@/components/DataInput/inputHandlerFactories";
import { ClientCardProps, ClientSetter } from "../ClientForm";
import { childBirthMonthList, childBirthYearList } from "@/app/clients/form/birthYearDropdown";

const maxNumberChildren = (value: string): boolean => {
    return parseInt(value) <= 20;
};

const getChild = (
    fieldSetter: ClientSetter,
    children: Person[],
    index: number,
    subFieldName: "gender" | "birthYear" | "birthMonth"
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        if (subFieldName === "gender") {
            children[index][subFieldName] = (input !== "Don't Know" ? input : "other") as Gender;
        } else {
            children[index][subFieldName] = parseInt(input);
        }
        fieldSetter({ children: [...children] });
    };
};

const NumberChildrenCard: React.FC<ClientCardProps> = ({
    formErrors,
    errorSetter,
    fieldSetter,
    fields,
}) => {
    return (
        <GenericFormCard
            title="Number of Children"
            required={true}
            text="Please enter a number between 0 and 20. (Note that children are under 16 years old)"
        >
            <>
                <FreeFormTextInput
                    id="client-number-children"
                    label="Number of Children"
                    defaultValue={
                        fields.numberOfChildren !== 0
                            ? fields.numberOfChildren.toString()
                            : undefined
                    }
                    error={errorExists(formErrors.numberOfChildren)}
                    helperText={errorText(formErrors.numberOfChildren)}
                    onChange={onChangeText(
                        fieldSetter,
                        errorSetter,
                        "numberOfChildren",
                        true,
                        numberRegex,
                        parseInt,
                        maxNumberChildren
                    )}
                />
                {fields.children.map((child: Person, index: number) => {
                    return (
                        <StyledCard key={child.primaryKey}>
                            <FormText>Child {index + 1}</FormText>
                            <DropdownListInput
                                selectLabelId="children-gender-select-label"
                                labelsAndValues={[
                                    ["Male", "male"],
                                    ["Female", "female"],
                                    ["Prefer Not To Say", "other"],
                                ]}
                                listTitle="Gender"
                                defaultValue={child.gender}
                                onChange={getChild(fieldSetter, fields.children, index, "gender")}
                            />
                            <DropdownListInput
                                selectLabelId="children-age-select-label"
                                labelsAndValues={childBirthYearList.map((year) => {
                                    return [year, year];
                                })}
                                listTitle="Year of Birth"
                                defaultValue={child.birthYear ? child.birthYear.toString() : "2024"}
                                onChange={getChild(
                                    fieldSetter,
                                    fields.children,
                                    index,
                                    "birthYear"
                                )}
                            />
                            <DropdownListInput
                                selectLabelId="children-birth-year-select-label"
                                labelsAndValues={childBirthMonthList}
                                listTitle="Month of Birth"
                                defaultValue={child.birthMonth ? child.birthMonth.toString() : "1"}
                                onChange={getChild(
                                    fieldSetter,
                                    fields.children,
                                    index,
                                    "birthMonth"
                                )}
                            />
                        </StyledCard>
                    );
                })}
            </>
        </GenericFormCard>
    );
};

export default NumberChildrenCard;
