import React from "react";
import CheckboxGroupInput from "@/components/DataInput/CheckboxGroupInput";
import { CardProps, onChangeCheckbox } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";

const PetFoodCard: React.FC<CardProps> = ({ fieldSetter, fields }) => {
    return (
        <GenericFormCard
            title="Pet Food"
            required={false}
            text="Tick all that apply. Specify any other requests in the 'Extra Information' section."
        >
            <CheckboxGroupInput
                labelsAndKeys={[
                    ["Cat", "Cat"],
                    ["Dog", "Dog"],
                ]}
                onChange={onChangeCheckbox(fieldSetter, fields.petFood, "petFood")}
            />
        </GenericFormCard>
    );
};

export default PetFoodCard;
