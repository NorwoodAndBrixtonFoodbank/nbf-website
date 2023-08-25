"use client";

import React, { useState } from "react";
import { CenterComponent, StyledForm } from "@/components/Form/formStyling";
import Button from "@mui/material/Button";
import AccountDetails from "@/app/admin/createUser/createUserFormSections/AccountDetails";
import UserRole from "@/app/admin/createUser/createUserFormSections/UserRole";
import {
    checkErrorOnSubmit,
    Errors,
    FormErrors,
    setError,
    setField,
} from "@/components/Form/formFunctions";
import { createUser } from "@/app/admin/adminActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import RefreshPageButton from "@/app/admin/common/RefreshPageButton";
import { Database } from "@/databaseTypesFile";
import Alert from "@mui/material/Alert/Alert";
import { User } from "@supabase/gotrue-js";

interface CreateUserDetails {
    email: string;
    password: string;
    role: Database["public"]["Enums"]["role"];
}

const initialFields: CreateUserDetails = {
    email: "",
    password: "",
    role: "caller",
};

const initialFormErrors: FormErrors = {
    email: Errors.initial,
    password: Errors.initial,
    role: Errors.none,
};

const formSections = [AccountDetails, UserRole];

const CreateUserForm: React.FC<{}> = () => {
    const [fields, setFields] = useState(initialFields);
    const [formErrors, setFormErrors] = useState(initialFormErrors);

    const fieldSetter = setField(setFields, fields);
    const errorSetter = setError(setFormErrors, formErrors);

    const [submitError, setSubmitError] = useState(Errors.none);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [createdUser, setCreatedUser] = useState<User | null>(null);

    const submitForm = async (): Promise<void> => {
        setSubmitDisabled(true);

        if (checkErrorOnSubmit(formErrors, setFormErrors)) {
            setSubmitError(Errors.submit);
            setSubmitDisabled(false);
            return;
        }

        const { error } = await createUser(fields);

        if (error) {
            setSubmitError(Errors.external);
            setSubmitErrorMessage(error.message);
            setSubmitDisabled(false);
            setCreatedUser(null);
            return;
        }

        setSubmitError(Errors.none);
        setSubmitDisabled(false);
        setCreatedUser(JSON.parse(data));
    };

    return (
        <CenterComponent>
            <StyledForm>
                {formSections.map((Card, index) => {
                    return (
                        <Card
                            key={index}
                            fields={fields}
                            fieldSetter={fieldSetter}
                            formErrors={formErrors}
                            errorSetter={errorSetter}
                        />
                    );
                })}

                {createdUser ? (
                    <Alert severity="success" action={<RefreshPageButton />}>
                        User <b>{createdUser.email}</b> created successfully.
                    </Alert>
                ) : (
                    <Button
                        startIcon={<FontAwesomeIcon icon={faUserPlus} />}
                        variant="contained"
                        onClick={submitForm}
                        disabled={submitDisabled}
                    >
                        Create User
                    </Button>
                )}

                {submitError && <Alert severity="error">{submitError}</Alert>}
            </StyledForm>
        </CenterComponent>
    );
};

export default CreateUserForm;
