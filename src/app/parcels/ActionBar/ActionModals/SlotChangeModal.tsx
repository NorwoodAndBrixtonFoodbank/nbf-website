import React, { useEffect, useState } from "react";
import GeneralActionModal, {
    ActionModalProps,
    Centerer,
    ConfirmButtons,
    Heading,
    WarningMessage,
    maxParcelsToShow,
} from "./GeneralActionModal";
import { Button } from "@mui/material";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import { SaveParcelStatusError, getStatusErrorMessageWithLogId } from "../Statuses";
import { ParcelsTableRow } from "../../parcelsTable/types";
import supabase from "@/supabaseClient";
import { AuditLog, sendAuditLog } from "@/server/auditLog";
import { logErrorReturnLogId, logWarningReturnLogId } from "@/logger/logger";
import { FetchParcelError, PackingSlotsLabelsAndValues, fetchPackingSlotsInfo, fetchParcel } from "@/common/fetch";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { UpdateParcelError } from "../../form/submitFormHelpers";

interface SlotInputProps {
    packingSlotsLabelsAndValues: PackingSlotsLabelsAndValues;
    setSlot: (slot: string) => void;
}

const SlotChangeInput: React.FC<SlotInputProps> = ({ packingSlotsLabelsAndValues, setSlot }) => {
    return (
        <>
            <Heading>What date would you like to change to?</Heading>
            <DropdownListInput
                selectLabelId="packing-slot-select-label"
                labelsAndValues={packingSlotsLabelsAndValues}
                listTitle="Packing Slot"
                defaultValue=""
                onChange={(event) => {
                    console.log(event);
                    setSlot(event.target.value ?? "");
                }}
            />
        </>
    );
};

const getSlotUpdateErrorMessage = (
    error: FetchParcelError | UpdateParcelError
): string => {
    let errorMessage: string;
    switch (error.type) {
        case "noMatchingParcels":
            errorMessage = "No parcel in the database matches the selected parcel.";
            break;
        case "failedToFetchParcel":
            errorMessage = "Failed to fetch parcel data.";
            break;
        case "failedToUpdateParcel":
            errorMessage = "Failed to fetch packing slots data.";
            break;
        case "concurrentUpdateConflict":
            errorMessage = `Record has been edited recently - please refresh the page.`;
            break;
    }
    return `${errorMessage} Log Id: ${error.logId}`;
};

const packingSlotUpdate = async (packingSlot: string, parcel: ParcelsTableRow) => {
    const { data: parcelData, error: fetchError } = await fetchParcel(
        parcel.parcelId,
        supabase
    );
    if (fetchError) {
        return { parcelId: null, error: fetchError };
    }

    const { error: updateError, count } = await supabase
        .from("parcels")
        .update({ packing_slot: packingSlot }, { count: "exact" })
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
        action: "change packing slot",
        content: { parcelDetails: parcelRecord, count: count },
        clientId: parcel.clientId,
        parcelId: parcel.parcelId,
    } as const satisfies Partial<AuditLog>;

    if (updateError) {
        const logId = await logErrorReturnLogId("Error with update: parcel data", updateError);
        await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
        return { parcelId: null, error: { type: "failedToUpdateParcel", logId } as UpdateParcelError };
    }

    if (count === 0) {
        const logId = await logWarningReturnLogId("Concurrent editing of parcel");
        await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
        return { parcelId: null, error: { type: "concurrentUpdateConflict", logId } as UpdateParcelError};
    }

    return { parcelId: parcel.parcelId, error: null };
};

const SlotChangeModal: React.FC<ActionModalProps> = (props) => {
    const [actionCompleted, setActionCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [packingSlots, setPackingSlots] = useState<[string, string][]>([]);
    const [slot, setSlot] = useState<string>("");
    const [displayModal, setDisplayModal] = useState<boolean>(true);
    const [warningMessage, setWarningMessage] = useState<string>("");

    (async () => {
        const { data: packingSlotsData, error: packingSlotsError } =
            await fetchPackingSlotsInfo(supabase);
        // const abc = {type: "adkadfs", logId: "askdnf"}
        if (packingSlotsError) {
            setErrorMessage(`Failed to fetch packing slots data. Log Id: ${packingSlotsError.logId}`);
            setDisplayModal(false)
            return;
        }
        setPackingSlots(packingSlotsData);
    })();

    const onSlotChange = async (): Promise<void> => {
        if (slot === "") {
            setWarningMessage("Please choose a valid packing slot.")
            return
        }
        let packingSlotUpdateError: FetchParcelError | UpdateParcelError | null = null;
        for (const parcel of props.selectedParcels) {
            (async () => {const { error } = await packingSlotUpdate(slot, parcel)
            if (error) {
                packingSlotUpdateError = error
                return
            }
        }
        )();
        };

        let newPackingSlotText: string = "";
        packingSlots.forEach((packingSlot) => {
            if (packingSlot[1] === slot) {
                newPackingSlotText = packingSlot[0];
            }
        });

        const { error: statusUpdateError } = await props.updateParcelStatuses(props.selectedParcels, props.newStatus, `new packing slot: ${newPackingSlotText}`, "change packing slot");
        if (packingSlotUpdateError) {
            setErrorMessage(getSlotUpdateErrorMessage(packingSlotUpdateError))
        }
        else if (statusUpdateError) {
            setErrorMessage(getStatusErrorMessageWithLogId(statusUpdateError));
        } else {
            setSuccessMessage(`Packing Slot Changed to ${newPackingSlotText}`);
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
                displayModal ? (
                    <ConfirmButtons>
                        <Button variant="contained" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={onSlotChange}>
                            Change
                        </Button>
                    </ConfirmButtons>
                ) : (
                    <></>
                )
                
            }
            contentAboveButton={
                displayModal ? (
                    <>
                        <SlotChangeInput packingSlotsLabelsAndValues={packingSlots} setSlot={setSlot} />
                        <SelectedParcelsOverview
                            parcels={props.selectedParcels}
                            maxParcelsToShow={maxParcelsToShow}
                        />
                        <WarningMessage>
                            {warningMessage}
                        </WarningMessage>
                        
                    </>
                ) : (
                    <></>
                )
            }
        />
    );
};

export default SlotChangeModal;
