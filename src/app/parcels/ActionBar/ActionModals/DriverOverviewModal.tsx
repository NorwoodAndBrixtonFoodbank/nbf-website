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
import DriverOverviewDownloadButton from "@/pdf/DriverOverview/DriverOverviewPdfButton";

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

const DriverOverviewModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
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

    const onDoAction = (): void => {
        updateParcelsStatuses();
        setActionCompleted(true);
    };

    return (
        <Modal {...props} onClose={onClose}>
            <ModalInner>
                {actionCompleted ? (
                    serverErrorMessage ? (
                        <ErrorSecondaryText>{serverErrorMessage}</ErrorSecondaryText>
                    ) : (
                        <Paragraph>Driver Overview Created</Paragraph>
                    )
                ) : (
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
                            <DriverOverviewDownloadButton
                                parcels={props.selectedParcels}
                                date={date}
                                driverName={driverName}
                                onClick={onDoAction}
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
