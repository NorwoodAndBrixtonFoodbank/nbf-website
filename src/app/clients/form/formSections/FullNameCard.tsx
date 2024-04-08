import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    errorExists,
    errorText,
    getDefaultTextValue,
    onChangeText,
} from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ClientCardProps } from "../ClientForm";

const FullNameCard: React.FC<ClientCardProps> = ({
    formErrors,
    errorSetter,
    fieldSetter,
    fields,
}) => {
    return (
        <GenericFormCard title="Client Full Name" required={true} text="First and last name">
            <FreeFormTextInput
                label="Name"
                defaultValue={getDefaultTextValue(fields, "fullName")}
                error={errorExists(formErrors.fullName)}
                helperText={errorText(formErrors.fullName)}
                onChange={onChangeText(fieldSetter, errorSetter, "fullName", true)}
            />
        </GenericFormCard>
    );
};
export default FullNameCard;
