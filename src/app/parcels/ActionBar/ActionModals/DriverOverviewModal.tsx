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
import { ParcelsTableRow } from "../../getParcelsTableData";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import DriverOverview from "@/pdf/DriverOverview/DriverOverview";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import Modal from "@/components/Modal/Modal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

interface DriverOverviewModalButtonProps {
    selectedParcels: ParcelsTableRow[];
    date: Dayjs;
    driverName: string;
    onDoAction: () => void;
}

interface DriverOverviewInputProps {
    onDateChange: (newDate: Dayjs | null) => void;
    onDriverNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DriverOverviewInput: React.FC<DriverOverviewInputProps> = ({
    onDateChange,
    onDriverNameChange,
}) => {
    return (
        <>
            <Heading>Delivery Information</Heading>
            <FreeFormTextInput onChange={onDriverNameChange} label="Driver's Name" />
            <DatePicker defaultValue={dayjs()} onChange={onDateChange} disablePast />
        </>
    );
};

const DriverOverviewModalButton: React.FC<DriverOverviewModalButtonProps> = ({
    selectedParcels,
    date,
    driverName,
    onDoAction,
}) => {
    const parcelIds = selectedParcels.map((parcel) => {
        return parcel.parcelId;
    });
    return (
        <DriverOverview
            driverName={driverName}
            date={date.toDate()}
            text="Download"
            parcelIds={parcelIds}
            onClick={onDoAction}
        />
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
                        />
                        <SelectedParcelsOverview
                            parcels={props.selectedParcels}
                            maxParcelsToShow={maxParcelsToShow}
                        />
                        <Centerer>
                            <DriverOverviewModalButton
                                selectedParcels={props.selectedParcels}
                                date={date}
                                driverName={driverName}
                                onDoAction={onDoAction}
                            />
                        </Centerer>
                    </>
                )}
            </ModalInner>
        </Modal>
    );
};

export default DriverOverviewModal;
