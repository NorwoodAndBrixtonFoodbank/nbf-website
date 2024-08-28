import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    errorExists,
    errorText,
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
            text="Please input not more than 380 characters."
        >
            <FreeFormTextInput
                label="For example, The doorbell does not work. Use the door code: xxxx."
                defaultValue={getDefaultTextValue(fields, "deliveryInstructions")}
                error={errorExists(formErrors.deliveryInstructions)}
                helperText={errorText(formErrors.deliveryInstructions)}
                onChange={onChangeText(
                    fieldSetter,
                    errorSetter,
                    "deliveryInstructions",
                    undefined,
                    undefined,
                    undefined,
                    (input, maxCharacters = MAX_CHARACTERS) => {
                        return input.length <= maxCharacters;
                    }
                )}
            />
        </GenericFormCard>
    );
};

export default DeliveryInstructionsCard;
