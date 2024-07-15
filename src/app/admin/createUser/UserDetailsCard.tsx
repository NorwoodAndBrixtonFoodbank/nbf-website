import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import { errorExists, errorText, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import React from "react";
import { InviteUserCardProps } from "./CreateUserForm";
import { phoneNumberRegex } from "@/common/format";

const UserDetailsCard: React.FC<InviteUserCardProps> = ({
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
                onChange={onChangeText(fieldSetter, errorSetter, "firstName", true)}
            />
            <FreeFormTextInput
                id="new-user-last-name"
                label="Last Name"
                error={errorExists(formErrors.lastName)}
                helperText={errorText(formErrors.lastName)}
                onChange={onChangeText(fieldSetter, errorSetter, "lastName", true)}
            />
            <FreeFormTextInput
                id="new-user-phone-number"
                label="Telephone Number"
                error={errorExists(formErrors.telephoneNumber)}
                helperText={errorText(formErrors.telephoneNumber)}
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
