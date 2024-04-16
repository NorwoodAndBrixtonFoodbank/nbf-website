"use client";

import React, { useState } from "react";
import {
    Centerer,
    Heading,
    maxParcelsToShow,
    ActionModalProps,
    ModalInner,
    Paragraph,
} from "./common";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import ShippingLabelsPdfButton, {
    ShippingLabelError,
} from "@/pdf/ShippingLabels/ShippingLabelsPdfButton";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import Modal from "@/components/Modal/Modal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import { sendAuditLog } from "@/server/auditLog";

interface ShippingLabelsInputProps {
    onLabelQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ShippingLabelsInput: React.FC<ShippingLabelsInputProps> = ({ onLabelQuantityChange }) => {
    return (
        <>
            <Heading>Shipping Labels</Heading>
            <FreeFormTextInput type="number" onChange={onLabelQuantityChange} label="Quantity" />
        </>
    );
};

const getPdfErrorMessage = (error: ShippingLabelError): string => {
    let errorMessage = "";
    switch (error.type) {
        case "failedToFetchParcel":
            errorMessage = "Failed to fetch selected parcel data.";
            break;
        case "noMatchingParcels":
            errorMessage = "No parcel in the database matches the one selected.";
            break;
        case "clientFetchFailed":
            errorMessage = "Failed to fetch client data for the selected parcel.";
            break;
        case "noMatchingClients":
            errorMessage = "No client in the database matches the client of the selected parcel.";
            break;
    }
    return `${errorMessage} LogId: ${error.logId}`;
};

const ShippingLabelModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<ShippingLabelError | null>(null);
    const updateParcelsStatuses = async (labelQuantity: number): Promise<void> => {
        const { error } = await props.updateParcelStatuses(
            props.selectedParcels,
            props.newStatus,
            labelQuantity.toString()
        );
        if (error) {
            setServerErrorMessage(getStatusErrorMessageWithLogId(error));
        }
    };

    const [labelQuantity, setLabelQuantity] = useState<number>(0);

    const onLabelQuantityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setLabelQuantity(parseInt(event.target.value, 10) ?? 0);
    };

    const isInputValid = labelQuantity > 0;

    const actionCompletedSuccessfully = actionCompleted && !serverErrorMessage && !pdfError;

    const onClose = (): void => {
        props.onClose();
        setLabelQuantity(0);
        setServerErrorMessage(null);
    };

    const onPdfCreationCompleted = (): void => {
        updateParcelsStatuses(labelQuantity);
        setActionCompleted(true);
        void sendAuditLog({
            action: "create shipping label pdf",
            wasSuccess: true,
            content: {
                parcelIds: props.selectedParcels.map((parcel) => parcel.parcelId),
                labelQuantity: labelQuantity,
            },
        });
    };

    const onPdfCreationFailed = (pdfError: ShippingLabelError): void => {
        setPdfError(pdfError);
        setActionCompleted(true);
        void sendAuditLog({
            action: "create shipping label pdf",
            wasSuccess: false,
            content: {
                parcelIds: props.selectedParcels.map((parcel) => parcel.parcelId),
                labelQuantity: labelQuantity,
            },
            logId: pdfError.logId,
        });
    };

    return (
        <Modal {...props} onClose={onClose}>
            <ModalInner>
                {pdfError && (
                    <ErrorSecondaryText>{getPdfErrorMessage(pdfError)}</ErrorSecondaryText>
                )}
                {serverErrorMessage && (
                    <ErrorSecondaryText>{serverErrorMessage}</ErrorSecondaryText>
                )}
                {actionCompletedSuccessfully && <Paragraph>Shipping Labels Created</Paragraph>}
                {!actionCompleted && (
                    <>
                        <ShippingLabelsInput onLabelQuantityChange={onLabelQuantityChange} />
                        <SelectedParcelsOverview
                            parcels={props.selectedParcels}
                            maxParcelsToShow={maxParcelsToShow}
                        />
                        <Centerer>
                            <ShippingLabelsPdfButton
                                disabled={!isInputValid}
                                text="Download"
                                parcel={props.selectedParcels[0]}
                                labelQuantity={labelQuantity}
                                onPdfCreationCompleted={onPdfCreationCompleted}
                                onPdfCreationFailed={onPdfCreationFailed}
                            />
                        </Centerer>
                    </>
                )}
            </ModalInner>
        </Modal>
    );
};

export default ShippingLabelModal;
