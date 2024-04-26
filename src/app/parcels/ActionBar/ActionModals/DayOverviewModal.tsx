"use client";

import React, { useState } from "react";
import GeneralActionModal, { Heading, ActionModalProps, maxParcelsToShow } from "./GeneralActionModal";
import DayOverviewPdfButton, { DayOverviewPdfError } from "@/pdf/DayOverview/DayOverviewPdfButton";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import { sendAuditLog } from "@/server/auditLog";
import SelectedParcelsOverview from "../SelectedParcelsOverview";

const getPdfErrorMessage = (error: DayOverviewPdfError): string => {
    let errorMessage: string;
    switch (error.type) {
        case "parcelFetchFailed":
            errorMessage = "Failed to fetch parcel data.";
            break;
    }
    return `${errorMessage} LogId: ${error.logId}`;
};

const DayOverviewModal: React.FC<ActionModalProps> = (props) => {
    const [actionShown, setActionShown] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onClose = (): void => {
        props.onClose();
        setErrorMessage(null);
    };

    const onPdfCreationCompleted = async (): Promise<void> => {
        const { error } = await props.updateParcelStatuses(props.selectedParcels, props.newStatus);
        if (error) {
            setErrorMessage(getStatusErrorMessageWithLogId(error));
        }
        setSuccessMessage("Day Overview Created");
        setActionShown(false);
        void sendAuditLog({
            action: "create day overview pdf",
            wasSuccess: true,
            content: { parcelIds: props.selectedParcels.map((parcel) => parcel.parcelId) },
        });
    };

    const onPdfCreationFailed = (pdfError: DayOverviewPdfError): void => {
        setErrorMessage(getPdfErrorMessage(pdfError));
        setActionShown(false);
        void sendAuditLog({
            action: "create day overview pdf",
            wasSuccess: false,
            content: { parcelIds: props.selectedParcels.map((parcel) => parcel.parcelId) },
            logId: pdfError.logId,
        });
    };

    return (
        <GeneralActionModal
            {...props}
            onClose={onClose}
            errorMessage={errorMessage}
            successMessage={successMessage}
            actionShown={actionShown}
            actionButton={
                <DayOverviewPdfButton
                    parcels={props.selectedParcels}
                    onPdfCreationCompleted={onPdfCreationCompleted}
                    onPdfCreationFailed={onPdfCreationFailed}
                />
            }
            contentAboveButton={
                <SelectedParcelsOverview
                    parcels={props.selectedParcels}
                    maxParcelsToShow={maxParcelsToShow}
                />
            }
        />
    );
};

export default DayOverviewModal;
