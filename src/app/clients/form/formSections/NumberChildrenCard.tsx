import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    errorExists,
    getErrorText,
    onChangeText,
    numberRegex,
    Person,
    Gender,
} from "@/components/Form/formFunctions";
import { UncontrolledSelect } from "@/components/DataInput/DropDownSelect";
import { StyledCard, FormText } from "@/components/Form/formStyling";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { SelectChangeEventHandler } from "@/components/DataInput/inputHandlerFactories";
import { ClientCardProps, ClientSetter } from "@/app/clients/form/ClientForm";
import {
    childBirthMonthList,
    getChildBirthYears,
    getCurrentYearChildBirthMonthList,
} from "@/app/clients/form/birthYearDropdown";
import { getCurrentYear } from "@/common/date";

const maxNumberChildren = (value: string): boolean => {
    return parseInt(value) <= 20;
};

const setChildrenFields = (
    fieldSetter: ClientSetter,
    children: Person[],
    index: number,
    subFieldName: "gender" | "birthYear" | "birthMonth"
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        switch (subFieldName) {
            case "gender":
                children[index][subFieldName] = (
                    input !== "Don't Know" ? input : "other"
                ) as Gender;
                break;
            case "birthYear":
                children[index][subFieldName] = parseInt(input);
                break;
            case "birthMonth":
                children[index][subFieldName] = parseInt(input);
                break;
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
                    helperText={getErrorText(formErrors.numberOfChildren)}
                    onChange={onChangeText(fieldSetter, errorSetter, "numberOfChildren", {
                        required: true,
                        regex: numberRegex,
                        formattingFunction: parseInt,
                        additionalCondition: maxNumberChildren,
                    })}
                />
                {fields.children.map((child: Person, index: number) => {
                    return (
                        <StyledCard key={child.primaryKey ?? `new-child-${index}`}>
                            <FormText>Child {index + 1}</FormText>
                            <UncontrolledSelect
                                selectLabelId="children-gender-select-label"
                                labelsAndValues={[
                                    ["Male", "male"],
                                    ["Female", "female"],
                                    ["Prefer Not To Say", "other"],
                                ]}
                                listTitle="Gender"
                                defaultValue={child.gender}
                                onChange={setChildrenFields(
                                    fieldSetter,
                                    fields.children,
                                    index,
                                    "gender"
                                )}
                            />
                            <UncontrolledSelect
                                selectLabelId="children-birth-year-select-label"
                                labelsAndValues={getChildBirthYears().map((year) => [
                                    `${year}`,
                                    `${year}`,
                                ])}
                                listTitle="Year of Birth (optional)"
                                defaultValue={child.birthYear?.toString()}
                                onChange={setChildrenFields(
                                    fieldSetter,
                                    fields.children,
                                    index,
                                    "birthYear"
                                )}
                            />
                            <UncontrolledSelect
                                selectLabelId="children-birth-month-select-label"
                                labelsAndValues={
                                    child.birthYear === getCurrentYear()
                                        ? getCurrentYearChildBirthMonthList()
                                        : childBirthMonthList
                                }
                                listTitle="Month of Birth (optional)"
                                defaultValue={child.birthMonth?.toString()}
                                onChange={setChildrenFields(
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
