import React from "react";
import CheckboxGroupInput from "@/components/DataInput/CheckboxGroupInput";
import { CardProps, checkboxGroupToArray, onChangeCheckbox } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";

const FeminineProductCard: React.FC<CardProps> = ({ fieldSetter, fields }) => {
    return (
        <GenericFormCard title="Feminine Products" required={false}>
            <CheckboxGroupInput
                labelsAndKeys={[
                    ["Tampons", "Tampons"],
                    ["Pads", "Pads"],
                    ["Incontinence Pads", "Incontinence Pads"],
                ]}
                onChange={onChangeCheckbox(
                    fieldSetter,
                    fields.feminineProducts,
                    "feminineProducts"
                )}
                defaultCheckedKeys={checkboxGroupToArray(fields.feminineProducts)}
            />
        </GenericFormCard>
    );
};

export default FeminineProductCard;
