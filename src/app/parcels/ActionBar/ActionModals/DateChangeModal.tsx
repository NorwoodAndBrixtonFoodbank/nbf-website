import React, { useEffect, useRef, useState } from "react";
import GeneralActionModal, {
    ActionModalProps,
    ConfirmButtons,
    Heading,
    WarningMessage,
    maxParcelsToShow,
} from "./GeneralActionModal";
import { Button } from "@mui/material";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import SingleDateInput from "@/components/DateInputs/SingleDateInput";
import dayjs, { Dayjs } from "dayjs";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import { getDbDate } from "@/common/format";
import { getUpdateErrorMessage, packingDateOrSlotUpdate } from "./CommonDateAndSlot";
import { ParcelsTableRow } from "../../parcelsTable/types";

interface DateChangeProps {
    setDate: (date: Dayjs) => void;
}

interface ContentProps {
    onClose: () => void;
    onDateSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    setDate: (date: Dayjs) => void;
    selectedParcels: ParcelsTableRow[];
    maxParcelsToShow: number;
    warningMessage: string;
}

const DateChangeInput = React.forwardRef<HTMLInputElement, DateChangeProps>(
    (props, elementToFocusRef) => {
        return (
            <>
                <Heading>What date would you like to change to?</Heading>
                <SingleDateInput setDate={props.setDate} ref={elementToFocusRef} />
            </>
        );
    }
);

DateChangeInput.displayName = "DateChangeInput";

const ModalContent: React.FC<ContentProps> = ({
    onClose,
    onDateSubmit,
    setDate,
    selectedParcels,
    maxParcelsToShow,
    warningMessage,
}) => {
    const elementToFocusRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        elementToFocusRef.current?.focus();
    }, []);

    return (
        <form onSubmit={(event) => onDateSubmit(event)}>
            <DateChangeInput setDate={setDate} ref={elementToFocusRef} />
            <SelectedParcelsOverview
                parcels={selectedParcels}
                maxParcelsToShow={maxParcelsToShow}
            />
            <WarningMessage>{warningMessage}</WarningMessage>
            <ConfirmButtons>
                <Button variant="contained" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained" type="submit">
                    Change
                </Button>
            </ConfirmButtons>
        </form>
    );
};

const DateChangeModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [date, setDate] = useState<Dayjs>();
    const [warningMessage, setWarningMessage] = useState<string>("");

    const onDateSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
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
            "Packing Date Changed",
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
        >
            {!actionCompleted && (
                <ModalContent
                    onClose={onClose}
                    onDateSubmit={onDateSubmit}
                    setDate={setDate}
                    selectedParcels={props.selectedParcels}
                    maxParcelsToShow={maxParcelsToShow}
                    warningMessage={warningMessage}
                />
            )}
        </GeneralActionModal>
    );
};
export default DateChangeModal;
