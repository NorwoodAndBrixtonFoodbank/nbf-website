import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import PasswordInput from "@/components/DataInput/PasswordInput";
import GenericFormCard from "@/components/Form/GenericFormCard";
import {
    CardProps,
    errorExists,
    Errors,
    errorText,
    onChangeText,
} from "@/components/Form/formFunctions";
import { passwordRule, passwordRuleDisplay } from "@/app/admin/common/passwordConfig";

const emailRegex = /^\S+@\S+$/;

const AccountDetails: React.FC<CardProps> = ({ fieldSetter, formErrors, errorSetter }) => {
    return (
        <GenericFormCard
            title="Account Details"
            text="Please enter the email and temporary password for the new user."
            required
        >
            <>
                <FreeFormTextInput
                    label="Email"
                    error={errorExists(formErrors.email)}
                    helperText={errorText(formErrors.email)}
                    onChange={onChangeText(fieldSetter, errorSetter, "email", true, emailRegex)}
                />
                <PasswordInput
                    label="Password"
                    error={errorExists(formErrors.password)}
                    helperText={
                        errorText(formErrors.password) === Errors.invalid
                            ? passwordRuleDisplay
                            : errorText(formErrors.password)
                    }
                    onChange={onChangeText(
                        fieldSetter,
                        errorSetter,
                        "password",
                        true,
                        undefined,
                        undefined,
                        passwordRule
                    )}
                />
            </>
        </GenericFormCard>
    );
};

export default AccountDetails;
