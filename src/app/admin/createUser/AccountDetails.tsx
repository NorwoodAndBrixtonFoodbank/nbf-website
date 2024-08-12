import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { errorExists, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import React from "react";
import { InviteUserCardProps } from "@/app/admin/createUser/CreateUserForm";
import onChangeText from "@/app/admin/createUser/onChangetextDeferredError";

const emailRegex = /^\S+@\S+$/;

const AccountDetails: React.FC<InviteUserCardProps> = ({
    fields,
    fieldSetter,
    formErrors,
    errorSetter,
}) => {
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
                    value={fields.email}
                    onChange={onChangeText(fieldSetter, errorSetter, "email", true, emailRegex)}
                />
            </>
        </GenericFormCard>
    );
};

export default AccountDetails;
