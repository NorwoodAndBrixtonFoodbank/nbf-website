import React from "react";
import CheckboxGroupInput from "@/components/DataInput/CheckboxGroupInput";
import { checkboxGroupToArray, onChangeCheckbox } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ClientCardProps } from "../ClientForm";

const FeminineProductCard: React.FC<ClientCardProps> = ({ fieldSetter, fields }) => {
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
