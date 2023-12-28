import React from "react";
import CheckboxGroupInput from "@/components/DataInput/CheckboxGroupInput";
import { CardProps, checkboxGroupToArray, onChangeCheckbox } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";

const OtherItemsCard: React.FC<CardProps> = ({ fieldSetter, fields }) => {
    return (
        <GenericFormCard title="Other Items" required={false}>
            <CheckboxGroupInput
                labelsAndKeys={[
                    ["Garlic", "Garlic"],
                    ["Ginger", "Ginger"],
                    ["Chillies", "Chillies"],
                    ["Spices", "Spices"],
                    ["Hot Water Bottles", "Hot Water Bottles"],
                    ["Blankets", "Blankets"],
                ]}
                onChange={onChangeCheckbox(fieldSetter, fields.otherItems, "otherItems")}
                defaultCheckedKeys={checkboxGroupToArray(fields.otherItems)}
            />
        </GenericFormCard>
    );
};

export default OtherItemsCard;
