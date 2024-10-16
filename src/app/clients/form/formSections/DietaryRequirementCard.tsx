import React from "react";
import CheckboxGroupInput from "@/components/DataInput/CheckboxGroupInput";
import { checkboxGroupToArray, onChangeCheckbox } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ClientCardProps } from "../ClientForm";

export const DIETARY_REQS_LABELS_AND_KEYS: [string, string][] = [
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
];

const DietaryRequirementCard: React.FC<ClientCardProps> = ({ fieldSetter, fields }) => {
    return (
        <GenericFormCard title="Dietary Requirements" required={false} text="Tick all that apply">
            <CheckboxGroupInput
                labelsAndKeys={DIETARY_REQS_LABELS_AND_KEYS}
                onChange={onChangeCheckbox(
                    fieldSetter,
                    fields.dietaryRequirements,
                    "dietaryRequirements"
                )}
                checkedKeys={checkboxGroupToArray(fields.dietaryRequirements)}
            />
        </GenericFormCard>
    );
};

export default DietaryRequirementCard;
