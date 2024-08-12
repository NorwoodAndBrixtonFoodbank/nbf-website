import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { errorExists, errorText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import React from "react";
import { InviteUserCardProps } from "./CreateUserForm";
import { phoneNumberRegex } from "@/common/format";
import onChangeText from "@/app/admin/createUser/onChangetextDeferredError";

const UserDetailsCard: React.FC<InviteUserCardProps> = ({
    fields,
    fieldSetter,
    formErrors,
    errorSetter,
}) => {
    return (
        <GenericFormCard
            title="User Details"
            text="Please enter the relevant information for the new user."
            required
        >
            <FreeFormTextInput
                id="new-user-first-name"
                label="First Name"
                error={errorExists(formErrors.firstName)}
                helperText={errorText(formErrors.firstName)}
                value={fields.firstName}
                onChange={onChangeText(fieldSetter, errorSetter, "firstName", true)}
            />
            <FreeFormTextInput
                id="new-user-last-name"
                label="Last Name"
                error={errorExists(formErrors.lastName)}
                helperText={errorText(formErrors.lastName)}
                value={fields.lastName}
                onChange={onChangeText(fieldSetter, errorSetter, "lastName", true)}
            />
            <FreeFormTextInput
                id="new-user-phone-number"
                label="Telephone Number"
                error={errorExists(formErrors.telephoneNumber)}
                helperText={errorText(formErrors.telephoneNumber)}
                value={fields.telephoneNumber}
                onChange={onChangeText(
                    fieldSetter,
                    errorSetter,
                    "telephoneNumber",
                    false,
                    phoneNumberRegex
                )}
            />
        </GenericFormCard>
    );
};

export default UserDetailsCard;
