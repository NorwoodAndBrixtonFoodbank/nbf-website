import React, { useState } from "react";
import GeneralActionModal, {
    ActionModalProps,
    ConfirmButtons,
    Heading,
    maxParcelsToShow,
} from "./GeneralActionModal";
import { Button } from "@mui/material";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import SingleDateInput, { DateRangeInputProps } from "@/components/DateInputs/SingleDateInput";
import dayjs, { Dayjs } from "dayjs";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import { ParcelsTableRow } from "../../parcelsTable/types";
import supabase from "@/supabaseClient";
import { getDbDate } from "@/common/format";
import { AuditLog, sendAuditLog } from "@/server/auditLog";
import { logErrorReturnLogId, logWarningReturnLogId } from "@/logger/logger";

const DateChangeInput: React.FC<DateRangeInputProps> = ({ setDate }) => {
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

    const packingDateUpdate = async (packingDate: string, parcel: ParcelsTableRow) => {
        const { error, count } = await supabase
            .from("parcels")
            .update({ packing_date: packingDate }, { count: "exact" })
            .eq("primary_key", parcel.parcelId);

        const auditLog = {
            action: "changing dates",
            content: { parcelDetails: {}, count: count },
            clientId: parcel.clientId,
            parcelId: parcel.parcelId,
        } as const satisfies Partial<AuditLog>;

        if (error) {
            const logId = await logErrorReturnLogId("Error with update: parcel data", error);
            await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
            return { parcelId: null, error: { type: "failedToUpdateParcel", logId } };
        }

        if (count === 0) {
            const logId = await logWarningReturnLogId("Concurrent editing of parcel");
            await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
            return { parcelId: null, error: { type: "concurrentUpdateConflict", logId } };
        }

        await sendAuditLog({ ...auditLog, wasSuccess: true });
        return { parcelId: parcel.parcelId, error: null };
    };

    const onDateChange = async (): Promise<void> => {
        const { error } = await props.updateParcelStatuses(props.selectedParcels, props.newStatus);
        if (error) {
            setErrorMessage(getStatusErrorMessageWithLogId(error));
        } else {
            setSuccessMessage(`Packing Date Changed to ${date}`);
        }
        setActionCompleted(true);

        props.selectedParcels.forEach((parcel) => {
            const packingDate = getDbDate(dayjs(date));
            packingDateUpdate(packingDate, parcel);
        });
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
