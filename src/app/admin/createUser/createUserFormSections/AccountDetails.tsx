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
import { checkPassword, userPasswordRules } from "@/app/admin/common/passwordConfig";
import { getPasswordHandler } from "@/components/DataInput/inputHandlerFactories";

const emailRegex = /^\S+@\S+$/;

const AccountDetails: React.FC<CardProps> = ({ fields, fieldSetter, formErrors, errorSetter }) => {
    let passwordError = Errors.initial;
    let passwordHelperText: string | null = "";

    const passwordOnChange = getPasswordHandler((password: string) => {
        fieldSetter("password", password);
        passwordHelperText = checkPassword(password, userPasswordRules);

        if (password.length === 0) {
            passwordError = Errors.required;
        } else if (passwordHelperText !== null) {
            passwordError = Errors.invalid;
        } else {
            passwordError = Errors.none;
        }

        errorSetter("password", passwordError);
    });

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
                            ? checkPassword(fields.password, userPasswordRules)!
                            : errorText(formErrors.password)
                    }
                    onChange={passwordOnChange}
                />
            </>
        </GenericFormCard>
    );
};

export default AccountDetails;
