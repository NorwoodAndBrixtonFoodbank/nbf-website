import React from "react";
import CheckboxGroupInput from "@/components/DataInput/CheckboxGroupInput";
import { checkboxGroupToArray, onChangeCheckbox } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ClientCardProps } from "../ClientForm";

export const FEMININE_PRODUCTS_LABELS_AND_KEYS: [string, string][] = [
    ["Tampons", "Tampons"],
    ["Pads", "Pads"],
    ["Incontinence Pads", "Incontinence Pads"],
];

const FeminineProductCard: React.FC<ClientCardProps> = ({ fieldSetter, fields }) => {
    return (
        <GenericFormCard title="Feminine Products" required={false}>
            <CheckboxGroupInput
                labelsAndKeys={FEMININE_PRODUCTS_LABELS_AND_KEYS}
                onChange={onChangeCheckbox(
                    fieldSetter,
                    fields.feminineProducts,
                    "feminineProducts"
                )}
                checkedKeys={checkboxGroupToArray(fields.feminineProducts)}
            />
        </GenericFormCard>
    );
};

export default FeminineProductCard;
