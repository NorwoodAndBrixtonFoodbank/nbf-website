import React from "react";
import CheckboxGroupInput from "@/components/DataInput/CheckboxGroupInput";
import { checkboxGroupToArray, onChangeCheckbox } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ClientCardProps } from "../ClientForm";

export const OTHER_ITEMS_LABELS_AND_KEYS: [string, string][] = [
    ["Garlic", "Garlic"],
    ["Ginger", "Ginger"],
    ["Chillies", "Chillies"],
    ["Spices", "Spices"],
    ["Hot Water Bottles", "Hot Water Bottles"],
    ["Blankets", "Blankets"],
];

const OtherItemsCard: React.FC<ClientCardProps> = ({ fieldSetter, fields }) => {
    return (
        <GenericFormCard title="Other Items" required={false}>
            <CheckboxGroupInput
                labelsAndKeys={OTHER_ITEMS_LABELS_AND_KEYS}
                onChange={onChangeCheckbox(fieldSetter, fields.otherItems, "otherItems")}
                checkedKeys={checkboxGroupToArray(fields.otherItems)}
            />
        </GenericFormCard>
    );
};

export default OtherItemsCard;
