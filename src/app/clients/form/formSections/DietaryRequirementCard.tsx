import React from "react";
import CheckboxGroupInput from "@/components/DataInput/CheckboxGroupInput";
import { CardProps, checkboxGroupToArray, onChangeCheckbox } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";

const DietaryRequirementCard: React.FC<CardProps> = ({ fieldSetter, fields }) => {
    return (
        <GenericFormCard title="Dietary Requirements" required={false} text="Tick all that apply">
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
                defaultCheckedKeys={checkboxGroupToArray(fields.dietaryRequirements)}
            />
        </GenericFormCard>
    );
};

export default DietaryRequirementCard;
