import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { CardProps, errorExists, errorText, onChangeText } from "@/components/Form/formFunctions";

const Acronymcard: React.FC<CardProps> = ({ fieldSetter, formErrors, errorSetter }) => {
    return (
        <GenericFormCard
            title="Acronym"
            text="Please enter the acronym of the collection centre."
            required
        >
            <FreeFormTextInput
                label="Acronym"
                error={errorExists(formErrors.name)}
                helperText={errorText(formErrors.name)}
                onChange={onChangeText(fieldSetter, errorSetter, "acronym", true)}
            />
        </GenericFormCard>
    );
};

export default Acronymcard;
