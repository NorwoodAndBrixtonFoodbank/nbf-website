import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    errorExists,
    getErrorText,
    getDefaultTextValue,
    onChangeText,
} from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ClientCardProps } from "@/app/clients/form/ClientForm";

const MAX_CHARACTERS = 380;

const DeliveryInstructionsCard: React.FC<ClientCardProps> = ({
    formErrors,
    errorSetter,
    fieldSetter,
    fields,
}) => {
    return (
        <GenericFormCard
            title="Delivery Instructions"
            required={false}
            text="For example: The doorbell does not work, use the door code: 123456."
        >
            <FreeFormTextInput
                label="Delivery Instructions"
                defaultValue={getDefaultTextValue(fields, "deliveryInstructions")}
                error={errorExists(formErrors.deliveryInstructions)}
                helperText={getErrorText(formErrors.deliveryInstructions, MAX_CHARACTERS)}
                onChange={onChangeText(fieldSetter, errorSetter, "deliveryInstructions", {
                    maxCharacters: MAX_CHARACTERS,
                })}
                multiline
            />
        </GenericFormCard>
    );
};

export default DeliveryInstructionsCard;
