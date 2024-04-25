import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { CardProps, errorExists, errorText, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import React from "react";

const emailRegex = /^\S+@\S+$/;

const AccountDetails: React.FC<CardProps> = ({ fieldSetter, formErrors, errorSetter }) => {
    return (
        <GenericFormCard
            title="Account Details"
            text="Please enter the email for the new user."
            required
        >
            <>
                <FreeFormTextInput
                    id="new-user-email-address"
                    label="Email"
                    error={errorExists(formErrors.email)}
                    helperText={errorText(formErrors.email)}
                    onChange={onChangeText(fieldSetter, errorSetter, "email", true, emailRegex)}
                />
            </>
        </GenericFormCard>
    );
};

export default AccountDetails;
