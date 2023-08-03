import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { CardProps, errorExists, errorText, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";

const FullNameCard: React.FC<CardProps> = ({ formErrors, errorSetter, fieldSetter }) => {
    return (
        <GenericFormCard title="Client Full Name" required={true} text="First and last name">
            <FreeFormTextInput
                label="Name"
                error={errorExists(formErrors.fullName)}
                helperText={errorText(formErrors.fullName)}
                onChange={onChangeText(fieldSetter, errorSetter, "fullName", true)}
            />
        </GenericFormCard>
    );
};
export default FullNameCard;
