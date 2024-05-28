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
import { fetchParcel } from "@/common/fetch";

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
        const { data: parcelData, error: fetchError } = await fetchParcel(parcel.parcelId, supabase)
        if (fetchError) {
            const logId = await logErrorReturnLogId("Failed to fetch parcel data.", fetchError);
            return { parcelId: null, error: { type: "failedToFetchParcel", logId } };
        }

        const { error: updateError, count } = await supabase
            .from("parcels")
            .update({ packing_date: packingDate }, { count: "exact" })
            .eq("primary_key", parcel.parcelId);

        const parcelRecord = {
            client_id: parcelData.client_id,
            packing_date: parcelData.packing_date,
            packing_slot: parcelData.packing_slot?.primary_key,
            voucher_number: parcelData.voucher_number,
            collection_centre: parcelData.collection_centre?.primary_key,
            collection_datetime: parcelData.collection_datetime,
            last_updated: parcelData.last_updated,
        };

        const auditLog = {
            action: "changing dates",
            content: { parcelDetails: parcelRecord , count: count },
            clientId: parcel.clientId,
            parcelId: parcel.parcelId,
        } as const satisfies Partial<AuditLog>;
        

        if (updateError) {
            const logId = await logErrorReturnLogId("Error with update: parcel data", updateError);
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
            setSuccessMessage(`Packing Date Changed to ${getDbDate(dayjs(date))}`);
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
