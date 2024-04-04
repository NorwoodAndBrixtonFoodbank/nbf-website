import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { CardProps, errorExists, errorText, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import React from "react";

const telephoneRegex = /^0\d{10}$/;
const UserDetailsCard: React.FC<CardProps> = ({ fieldSetter, formErrors, errorSetter }) => {
    return (
        <GenericFormCard
            title="User Details"
            text="Please enter the relevant information for the new user."
            required
        >
            <FreeFormTextInput
                label="First Name"
                error={errorExists(formErrors.firstName)}
                helperText={errorText(formErrors.firstName)}
                onChange={onChangeText(fieldSetter, errorSetter, "firstName", true)}
            />
            <FreeFormTextInput
                label="Last Name"
                error={errorExists(formErrors.lastName)}
                helperText={errorText(formErrors.lastName)}
                onChange={onChangeText(fieldSetter, errorSetter, "lastName", true)}
            />
            <FreeFormTextInput
                label="Telephone Number"
                error={errorExists(formErrors.telephoneNumber)}
                helperText={errorText(formErrors.telephoneNumber)}
                onChange={onChangeText(
                    fieldSetter,
                    errorSetter,
                    "telephoneNumber",
                    true,
                    telephoneRegex
                )}
            />
        </GenericFormCard>
    );
};

export default UserDetailsCard;
