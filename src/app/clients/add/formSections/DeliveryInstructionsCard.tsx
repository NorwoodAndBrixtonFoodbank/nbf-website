import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { CardProps, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";

const DeliveryInstructionsCard: React.FC<CardProps> = ({ errorSetter, fieldSetter }) => {
    return (
        <GenericFormCard title="Delivery Instructions" required={false}>
            <FreeFormTextInput
                label="For example, The doorbell does not work. Use the door code: xxxx."
                onChange={onChangeText(fieldSetter, errorSetter, "deliveryInstructions")}
            />
        </GenericFormCard>
    );
};

export default DeliveryInstructionsCard;
