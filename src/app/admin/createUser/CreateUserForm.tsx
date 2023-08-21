import React, { useState } from "react";
import { CenterComponent, FormErrorText, StyledForm } from "@/components/Form/formStyling";
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
import RefreshPageButton from "@/app/admin/RefreshPageButton";
import { Database } from "@/database_types_file";

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
    const [submitErrorMessage, setSubmitErrorMessage] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [refreshRequired, setRefreshRequired] = useState(false);

    const submitForm = async (): Promise<void> => {
        setSubmitDisabled(true);

        if (checkErrorOnSubmit(formErrors, setFormErrors)) {
            setSubmitError(Errors.submit);
            setSubmitDisabled(false);
            return;
        }

        const response = await createUser(fields);

        if (response.error) {
            setSubmitError(Errors.external);
            setSubmitErrorMessage(response.error.message);
            setSubmitDisabled(false);
            return;
        }

        setSubmitError(Errors.none);
        setSubmitErrorMessage("");
        setSubmitDisabled(false);
        setRefreshRequired(true);
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

                {refreshRequired ? (
                    <RefreshPageButton />
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

                {/* TODO VFB-23 Improve error message formatting for request errors */}
                <FormErrorText>{submitErrorMessage + submitError}</FormErrorText>
            </StyledForm>
        </CenterComponent>
    );
};

export default CreateUserForm;
