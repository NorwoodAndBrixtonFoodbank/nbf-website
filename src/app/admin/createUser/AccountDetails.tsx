import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { errorExists, errorText, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import React from "react";
import { InviteUserCardProps } from "./CreateUserForm";

const emailRegex = /^\S+@\S+$/;

const AccountDetails: React.FC<InviteUserCardProps> = ({ fieldSetter, formErrors, errorSetter }) => {
    return (
        <GenericFormCard
            title="Account Details"
            text="Please enter the email for the new user."
            required
        >
            <>
                <FreeFormTextInput
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
