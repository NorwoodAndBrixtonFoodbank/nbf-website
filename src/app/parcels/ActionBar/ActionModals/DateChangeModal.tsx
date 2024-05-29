import React, { useState } from "react";
import GeneralActionModal, {
    ActionModalProps,
    ConfirmButtons,
    Heading,
    maxParcelsToShow,
} from "./GeneralActionModal";
import { Button } from "@mui/material";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import SingleDateInput, { DateInputProps } from "@/components/DateInputs/SingleDateInput";
import dayjs, { Dayjs } from "dayjs";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import { getDbDate } from "@/common/format";
import { FetchParcelError } from "@/common/fetch";
import { UpdateParcelError } from "../../form/submitFormHelpers";
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

    const [date, setDate] = useState<Dayjs>(dayjs());

    const onDateChange = async (): Promise<void> => {
        const newPackingDate = getDbDate(dayjs(date));
        let packingDateUpdateError: FetchParcelError | UpdateParcelError | null = null;
        for (const parcel of props.selectedParcels) {
            (async () => {
                const { error } = await packingDateOrSlotUpdate(
                    "packingDate",
                    newPackingDate,
                    parcel
                );
                if (error) {
                    packingDateUpdateError = error;
                    return;
                }
            })();
        }

        const { error: statusUpdateError } = await props.updateParcelStatuses(
            props.selectedParcels,
            props.newStatus,
            `new packing date: ${newPackingDate}`,
            "change packing date"
        );
        if (packingDateUpdateError) {
            setErrorMessage(getUpdateErrorMessage(packingDateUpdateError));
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
                    <Button variant="contained" onClick={onDateChange}>
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
                </>
            }
        />
    );
};
export default DateChangeModal;
