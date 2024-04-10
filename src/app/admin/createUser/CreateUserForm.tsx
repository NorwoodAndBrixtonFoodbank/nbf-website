"use client";

import React, { useState } from "react";
import { CenterComponent, StyledForm } from "@/components/Form/formStyling";
import Button from "@mui/material/Button";
import AccountDetails from "@/app/admin/createUser/AccountDetails";
import UserRoleCard from "@/app/admin/createUser/UserRoleCard";
import {
    checkErrorOnSubmit,
    Errors,
    FormErrors,
    setError,
    setField,
} from "@/components/Form/formFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import RefreshPageButton from "@/app/admin/common/RefreshPageButton";
import { Database } from "@/databaseTypesFile";
import Alert from "@mui/material/Alert/Alert";
import { User } from "@supabase/gotrue-js";
import { logInfoReturnLogId } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";
import UserDetailsCard from "@/app/admin/createUser/UserDetailsCard";
import { InviteUserErrorType, adminInviteUser } from "@/server/adminInviteUser";

export interface InviteUserDetails {
    email: string;
    role: Database["public"]["Enums"]["role"];
    firstName: string;
    lastName: string;
    telephoneNumber: string;
}

const initialFields: InviteUserDetails = {
    email: "",
    role: "caller",
    firstName: "",
    lastName: "",
    telephoneNumber: "",
};

const initialFormErrors: FormErrors = {
    email: Errors.initial,
    role: Errors.none,
    firstName: Errors.initial,
    lastName: Errors.initial,
    telephoneNumber: Errors.initial,
};

const formSections = [AccountDetails, UserRoleCard, UserDetailsCard];

const CreateUserForm: React.FC<{}> = () => {
    const [fields, setFields] = useState(initialFields);
    const [formErrors, setFormErrors] = useState(initialFormErrors);

    const fieldSetter = setField(setFields, fields);
    const errorSetter = setError(setFormErrors, formErrors);

    const [formError, setFormError] = useState(Errors.none);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [serverError, setServerError] = useState<InviteUserErrorType | null>(null);

    const [invitedUser, setInvitedUser] = useState<User | null>(null);

    const submitForm = async (): Promise<void> => {
        setSubmitDisabled(true);
        setFormError(Errors.none);
        setServerError(null);

        if (checkErrorOnSubmit(formErrors, setFormErrors)) {
            setFormError(Errors.submit);
            setSubmitDisabled(false);
            return;
        }

        const redirectUrl = `${window.location.origin}/set-password`;

        const { data, error } = await adminInviteUser(fields, redirectUrl);

        if (error) {
            setServerError(error.type);
            setSubmitDisabled(false);
            setInvitedUser(null);
            throw new DatabaseError("insert", "invite user", error.logId);
        }

        setFormError(Errors.none);
        setSubmitDisabled(false);
        setInvitedUser(data);
        void logInfoReturnLogId(
            `User ${fields.email} with role ${fields.role} invited successfully.`
        );
    };

    return (
        <CenterComponent>
            <StyledForm>
                {formSections.map((Card, index) => {
                    return (
                        <Card
                            key={index} // eslint-disable-line react/no-array-index-key
                            fields={fields}
                            fieldSetter={fieldSetter}
                            formErrors={formErrors}
                            errorSetter={errorSetter}
                        />
                    );
                })}

                {invitedUser ? (
                    <Alert severity="success" action={<RefreshPageButton />}>
                        User <b>{invitedUser.email}</b> invited successfully.
                    </Alert>
                ) : (
                    <Button
                        startIcon={<FontAwesomeIcon icon={faUserPlus} />}
                        variant="contained"
                        onClick={submitForm}
                        disabled={submitDisabled}
                    >
                        Invite User
                    </Button>
                )}
                {serverError && <Alert severity="error">{serverError}</Alert>}
                {formError && <Alert severity="error">{formError}</Alert>}
            </StyledForm>
        </CenterComponent>
    );
};

export default CreateUserForm;
