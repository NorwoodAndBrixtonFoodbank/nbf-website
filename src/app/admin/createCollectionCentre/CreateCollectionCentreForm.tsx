"use client";

import React, { useState } from "react";
import { CenterComponent, FormErrorText, StyledForm } from "@/components/Form/formStyling";
import Button from "@mui/material/Button";
import {
    checkErrorOnSubmit,
    Errors,
    FormErrors,
    setError,
    setField,
} from "@/components/Form/formFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import RefreshPageButton from "@/app/admin/RefreshPageButton";
import { Schema } from "@/database_utils";
import NameCard from "@/app/admin/createCollectionCentre/NameCard";
import AcronymCard from "@/app/admin/createCollectionCentre/AcronymCard";
import supabase from "@/supabaseClient";

const initialFields: Schema["collection_centres"] = {
    primary_key: "",
    name: "",
    acronym: "",
};

const initialFormErrors: FormErrors = {
    name: Errors.initial,
    acronym: Errors.initial,
};

const formSections = [NameCard, AcronymCard];

const CreateCollectionCentreForm: React.FC<{}> = () => {
    const [fields, setFields] = useState(initialFields);
    const [formErrors, setFormErrors] = useState(initialFormErrors);

    const [submitError, setSubmitError] = useState(Errors.none);
    const [submitErrorMessage, setSubmitErrorMessage] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [refreshRequired, setRefreshRequired] = useState(false);

    const fieldSetter = setField(setFields, fields);
    const errorSetter = setError(setFormErrors, formErrors);

    const submitForm = async (): Promise<void> => {
        setSubmitDisabled(true);

        if (checkErrorOnSubmit(formErrors, setFormErrors)) {
            setSubmitError(Errors.submit);
            setSubmitDisabled(false);
            return;
        }

        const { error } = await supabase.from("collection_centres").insert(fields);

        if (error) {
            setSubmitError(Errors.external);
            setSubmitErrorMessage(error.message);
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
                {formSections.map((Card, index) => (
                    <Card
                        key={index}
                        fields={fields}
                        fieldSetter={fieldSetter}
                        formErrors={formErrors}
                        errorSetter={errorSetter}
                    />
                ))}

                {refreshRequired ? (
                    <RefreshPageButton />
                ) : (
                    <Button
                        startIcon={<FontAwesomeIcon icon={faBuildingCircleArrowRight} />}
                        variant="contained"
                        onClick={submitForm}
                        disabled={submitDisabled}
                    >
                        Create Collection Centre
                    </Button>
                )}

                <FormErrorText>{submitErrorMessage + submitError}</FormErrorText>
            </StyledForm>
        </CenterComponent>
    );
};

export default CreateCollectionCentreForm;
