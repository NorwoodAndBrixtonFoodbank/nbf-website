import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { errorExists, errorText, onChangeTextDeferredError } from "@/components/Form/formFunctions";
import React from "react";
import { UserFormProps } from "@/app/admin/createUser/CreateUserForm";
import GenericFormCard from "@/components/Form/GenericFormCard";
const emailRegex = /^\S+@\S+$/;

const AccountDetailsCard: React.FC<UserFormProps> = ({
    fields,
    fieldSetter,
    formErrors,
    errorSetter,
    clearInvitedUser,
}) => {
    return (
        <GenericFormCard
            title="Account Details"
            text="Please enter the email for the new user."
            required={true}
            compactVariant={true}
        >
            <FreeFormTextInput
                id="new-user-email-address"
                label="Email"
                error={errorExists(formErrors.email)}
                helperText={errorText(formErrors.email)}
                value={fields.email}
                onChange={onChangeTextDeferredError(
                    fieldSetter,
                    errorSetter,
                    "email",
                    true,
                    emailRegex,
                    clearInvitedUser
                )}
            />
        </GenericFormCard>
    );
};

export default AccountDetailsCard;
