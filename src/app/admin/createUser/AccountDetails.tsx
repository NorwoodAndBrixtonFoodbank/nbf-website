import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { errorExists, errorText } from "@/components/Form/formFunctions";
import React from "react";
import { UserFormProps } from "@/app/admin/createUser/CreateUserForm";
import onChangeText from "@/app/admin/createUser/onChangetextDeferredError";
import UserFormCard from "@/app/admin/createUser/CardFormat";

const emailRegex = /^\S+@\S+$/;

const AccountDetails: React.FC<UserFormProps> = ({
    fields,
    fieldSetter,
    formErrors,
    errorSetter,
    InvitedUserSetter,
}) => {
    return (
        <UserFormCard
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
                    value={fields.email}
                    onChange={onChangeText(
                        fieldSetter,
                        errorSetter,
                        "email",
                        true,
                        emailRegex,
                        InvitedUserSetter
                    )}
                    fullWidth={true}
                />
            </>
        </UserFormCard>
    );
};

export default AccountDetails;
