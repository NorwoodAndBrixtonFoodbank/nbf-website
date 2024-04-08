import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { getDefaultTextValue, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ClientCardProps } from "../ClientForm";

const DeliveryInstructionsCard: React.FC<ClientCardProps> = ({
    errorSetter,
    fieldSetter,
    fields,
}) => {
    return (
        <GenericFormCard title="Delivery Instructions" required={false}>
            <FreeFormTextInput
                label="For example, The doorbell does not work. Use the door code: xxxx."
                defaultValue={getDefaultTextValue(fields, "deliveryInstructions")}
                onChange={onChangeText(fieldSetter, errorSetter, "deliveryInstructions")}
            />
        </GenericFormCard>
    );
};

export default DeliveryInstructionsCard;
