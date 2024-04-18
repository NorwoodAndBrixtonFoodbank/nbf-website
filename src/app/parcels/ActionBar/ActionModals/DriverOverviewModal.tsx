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
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import Modal from "@/components/Modal/Modal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import DriverOverviewPdfButton, {
    DriverOverviewError,
} from "@/pdf/DriverOverview/DriverOverviewPdfButton";
import { sendAuditLog } from "@/server/auditLog";

interface DriverOverviewInputProps {
    onDateChange: (newDate: Dayjs | null) => void;
    onDriverNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setDateValid: () => void;
    setDateInvalid: () => void;
}

const DriverOverviewInput: React.FC<DriverOverviewInputProps> = ({
    onDateChange,
    onDriverNameChange,
    setDateValid,
    setDateInvalid,
}) => {
    return (
        <>
            <Heading>Delivery Information</Heading>
            <FreeFormTextInput onChange={onDriverNameChange} label="Driver's Name" />
            <DatePicker
                defaultValue={dayjs()}
                onChange={onDateChange}
                onError={(error) => {
                    if (error) {
                        setDateInvalid();
                    } else {
                        setDateValid();
                    }
                }}
                disablePast
            />
        </>
    );
};

const getPdfErrorMessage = (error: DriverOverviewError): string => {
    let errorMessage: string;
    switch (error.type) {
        case "parcelFetchFailed":
            errorMessage = "Failed to fetch parcel data.";
            break;
        case "noMatchingClient":
            errorMessage = "Failed to find a client for one or more of the parcels.";
            break;
        case "driverMessageFetchFailed":
            errorMessage = "Failed to fetch driver overview message.";
            break;
    }
    return `${errorMessage} LogId: ${error.logId}`;
};

const DriverOverviewModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<DriverOverviewError | null>(null);

    const updateParcelsStatuses = async (): Promise<void> => {
        const { error } = await props.updateParcelStatuses(props.selectedParcels, props.newStatus);
        if (error) {
            setServerErrorMessage(getStatusErrorMessageWithLogId(error));
        }
    };

    const [driverName, setDriverName] = useState("");
    const [date, setDate] = useState(dayjs());

    const [isDateValid, setIsDateValid] = useState(true);

    const onDriverNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setDriverName(event.target.value);
    };
    const onDateChange = (newDate: Dayjs | null): void => {
        setDate(newDate!);
    };

    const onClose = (): void => {
        props.onClose();
        setDate(dayjs());
        setDriverName("");
        setServerErrorMessage(null);
    };

    const onPdfCreationCompleted = async (): Promise<void> => {
        await updateParcelsStatuses();
        setActionCompleted(true);
        void sendAuditLog({
            action: "create driver overview pdf",
            wasSuccess: true,
            content: {
                parcelIds: props.selectedParcels.map((parcel) => parcel.parcelId),
                date: date.toString(),
                driverName: driverName,
            },
        });
    };

    const onPdfCreationFailed = (pdfError: DriverOverviewError): void => {
        setPdfError(pdfError);
        setActionCompleted(true);
        void sendAuditLog({
            action: "create driver overview pdf",
            wasSuccess: false,
            content: {
                parcelIds: props.selectedParcels.map((parcel) => parcel.parcelId),
                date: date.toString(),
                driverName: driverName,
            },
            logId: pdfError.logId,
        });
    };

    const actionCompletedSuccessfully = actionCompleted && !serverErrorMessage && !pdfError;

    return (
        <Modal {...props} onClose={onClose}>
            <ModalInner>
                {pdfError && (
                    <ErrorSecondaryText>{getPdfErrorMessage(pdfError)}</ErrorSecondaryText>
                )}
                {serverErrorMessage && (
                    <ErrorSecondaryText>{serverErrorMessage}</ErrorSecondaryText>
                )}
                {actionCompletedSuccessfully && <Paragraph>Driver Overview Created</Paragraph>}
                {!actionCompleted && (
                    <>
                        <DriverOverviewInput
                            onDateChange={onDateChange}
                            onDriverNameChange={onDriverNameChange}
                            setDateValid={() => setIsDateValid(true)}
                            setDateInvalid={() => setIsDateValid(false)}
                        />
                        <SelectedParcelsOverview
                            parcels={props.selectedParcels}
                            maxParcelsToShow={maxParcelsToShow}
                        />
                        <Centerer>
                            <DriverOverviewPdfButton
                                parcels={props.selectedParcels}
                                date={date}
                                driverName={driverName}
                                onPdfCreationCompleted={onPdfCreationCompleted}
                                onPdfCreationFailed={onPdfCreationFailed}
                                disabled={!isDateValid}
                                text="Download"
                            />
                        </Centerer>
                    </>
                )}
            </ModalInner>
        </Modal>
    );
};

export default DriverOverviewModal;
