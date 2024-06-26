import React, { useState } from "react";
import GeneralActionModal, {
    ActionModalProps,
    ConfirmButtons,
    Heading,
    WarningMessage,
    maxParcelsToShow,
} from "./GeneralActionModal";
import { Button } from "@mui/material";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import SingleDateInput, { DateInputProps } from "@/components/DateInputs/SingleDateInput";
import dayjs, { Dayjs } from "dayjs";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import { getDbDate } from "@/common/format";
import { getUpdateErrorMessage, packingDateOrSlotUpdate } from "./CommonDateAndSlot";

const DateChangeInput: React.FC<DateInputProps> = ({ setDate }) => {
    return (
        <>
            <Heading>What date would you like to change to?</Heading>
            <SingleDateInput setDate={setDate} />
        </>
    );
};

const DateChangeModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [date, setDate] = useState<Dayjs>();
    const [warningMessage, setWarningMessage] = useState<string>("");

    const onDateSubmit = async (): Promise<void> => {
        if (!date) {
            setWarningMessage("Please choose a valid packing date.");
            return;
        }
        const newPackingDate = getDbDate(dayjs(date));

        const packingDateUpdateErrors = await Promise.all(
            props.selectedParcels.map((parcel) => {
                return packingDateOrSlotUpdate("packingDate", newPackingDate, parcel);
            })
        );

        const { error: statusUpdateError } = await props.updateParcelStatuses(
            props.selectedParcels,
            props.newStatus,
            `new packing date: ${newPackingDate}`,
            "change packing date"
        );
        if (
            !packingDateUpdateErrors.every(
                (packingDateUpdateError) => packingDateUpdateError.error === null
            )
        ) {
            setErrorMessage(
                packingDateUpdateErrors
                    .map((packingDateUpdateError) => getUpdateErrorMessage(packingDateUpdateError))
                    .join("")
            );
        } else if (statusUpdateError) {
            setErrorMessage(getStatusErrorMessageWithLogId(statusUpdateError));
        } else {
            setSuccessMessage(`Packing Date Changed to ${newPackingDate}`);
        }
        setActionCompleted(true);
    };

    const onClose = (): void => {
        props.onClose();
        setErrorMessage(null);
    };

    return (
        <GeneralActionModal
            {...props}
            onClose={onClose}
            errorMessage={errorMessage}
            successMessage={successMessage}
            actionShown={!actionCompleted}
            actionButton={
                <ConfirmButtons>
                    <Button variant="contained" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={onDateSubmit}>
                        Change
                    </Button>
                </ConfirmButtons>
            }
            contentAboveButton={
                <>
                    <DateChangeInput setDate={setDate} />
                    <SelectedParcelsOverview
                        parcels={props.selectedParcels}
                        maxParcelsToShow={maxParcelsToShow}
                    />
                    <WarningMessage>{warningMessage}</WarningMessage>
                </>
            }
        />
    );
};
export default DateChangeModal;
