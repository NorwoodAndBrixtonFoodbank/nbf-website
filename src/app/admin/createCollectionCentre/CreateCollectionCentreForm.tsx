"use client";

import React, { useState } from "react";
import { CenterComponent, FormErrorText, StyledForm } from "@/components/Form/formStyling";
import Button from "@mui/material/Button";
import {
    checkErrorOnSubmit,
    Errors,
    FormErrors,
    createSetter,
    CardProps,
} from "@/components/Form/formFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import RefreshPageButton from "@/app/admin/common/RefreshPageButton";
import AcronymCard from "@/app/admin/createCollectionCentre/AcronymCard";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import { AuditLog, sendAuditLog } from "@/server/auditLog";
import Alert from "@mui/material/Alert/Alert";
import NameCard from "./NameCard";

interface CollectionCentreFields {
    name: string;
    acronym: string;
}

interface CollectionCentreErrors extends FormErrors<CollectionCentreFields> {
    name: Errors;
    acronym: Errors;
}

export type CollectionCentreCardProps = CardProps<CollectionCentreFields, CollectionCentreErrors>;

const initialFields: CollectionCentreFields = {
    name: "",
    acronym: "",
};

const initialFormErrors: CollectionCentreErrors = {
    name: Errors.initial,
    acronym: Errors.initial,
};

const formSections = [NameCard, AcronymCard];

const getCustomErrorMessage = (errorCode: string): string | null => {
    if (errorCode === "23505") {
        return "A Collection Centre with this name/abbreviation has already been added. Please choose a different name/abbreviation";
    }
    return null;
};

const CreateCollectionCentreForm: React.FC<{}> = () => {
    const [fields, setFields] = useState(initialFields);
    const [formErrors, setFormErrors] = useState(initialFormErrors);

    const [submitErrorMessage, setSubmitErrorMessage] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [newCollectionCentre, setNewCollectionCentre] = useState<string | null>(null);

    const fieldSetter = createSetter(setFields, fields);
    const errorSetter = createSetter(setFormErrors, formErrors);

    const submitForm = async (): Promise<void> => {
        setSubmitDisabled(true);

        if (
            checkErrorOnSubmit<CollectionCentreFields, CollectionCentreErrors>(
                formErrors,
                setFormErrors
            )
        ) {
            setSubmitDisabled(false);
            return;
        }

        const { data, error } = await supabase
            .from("collection_centres")
            .insert(fields)
            .select()
            .single();

        const auditLog = {
            action: "add a collection centre",
            content: { collectionCentreDetails: { acronym: fields.acronym, name: fields.name } },
        } as const satisfies Partial<AuditLog>;

        if (error) {
            const logId = await logErrorReturnLogId("Error with insert: collection centre", {
                error: error,
            });
            await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
            const errorMessage =
                getCustomErrorMessage(error.code) ?? `${error.message}\n${Errors.external}`;
            setSubmitErrorMessage(`Error: ${errorMessage} Log ID ${logId}`);
            setSubmitDisabled(false);
            return;
        }

        setSubmitErrorMessage("");
        setSubmitDisabled(false);
        await sendAuditLog({ ...auditLog, wasSuccess: true, collectionCentreId: data.primary_key });
        void logInfoReturnLogId(`Collection centre: ${data.name} has been created successfully.`);
        setNewCollectionCentre(data.name);
    };

    return (
        <CenterComponent>
            <StyledForm>
                {formSections.map((Card, index) => (
                    <Card
                        key={index} // eslint-disable-line react/no-array-index-key
                        fields={fields}
                        fieldSetter={fieldSetter}
                        formErrors={formErrors}
                        errorSetter={errorSetter}
                    />
                ))}

                {newCollectionCentre ? (
                    <Alert severity="success" action={<RefreshPageButton />}>
                        Collection centre <b>{newCollectionCentre}</b> added successfully.
                    </Alert>
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

                <FormErrorText>{submitErrorMessage}</FormErrorText>
            </StyledForm>
        </CenterComponent>
    );
};

export default CreateCollectionCentreForm;
