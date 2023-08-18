import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import PasswordInput from "@/components/DataInput/PasswordInput";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { CardProps, errorExists, errorText, onChangeText } from "@/components/Form/formFunctions";

const AccountDetails: React.FC<CardProps> = ({ fieldSetter, formErrors, errorSetter }) => {
    return (
        <GenericFormCard
            title="Account Details"
            required={true}
            text="Please enter the email and temporary password for the new user."
        >
            <>
                {/* TODO VFB-23 ADD REGEX CHECK FOR EMAIL */}
                <FreeFormTextInput
                    label="Email"
                    error={errorExists(formErrors.email)}
                    helperText={errorText(formErrors.email)}
                    onChange={onChangeText(fieldSetter, errorSetter, "email", true)}
                />
                <PasswordInput
                    label="Password"
                    error={errorExists(formErrors.password)}
                    helperText={errorText(formErrors.password)}
                    onChange={onChangeText(fieldSetter, errorSetter, "password", true)}
                />
            </>
        </GenericFormCard>
    );
};

export default AccountDetails;
