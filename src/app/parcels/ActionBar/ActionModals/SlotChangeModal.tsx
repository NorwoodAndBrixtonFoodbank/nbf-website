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
import { getStatusErrorMessageWithLogId } from "../Statuses";
import supabase from "@/supabaseClient";
import {
    FetchParcelError,
    PackingSlotsLabelsAndValues,
    fetchPackingSlotsInfo,
} from "@/common/fetch";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { UpdateParcelError } from "../../form/submitFormHelpers";
import { getUpdateErrorMessage, packingDateOrSlotUpdate } from "./CommonDateAndSlot";

interface SlotInputProps {
    packingSlotsLabelsAndValues: PackingSlotsLabelsAndValues;
    setSlot: (slot: string) => void;
}

const SlotChangeInput: React.FC<SlotInputProps> = ({ packingSlotsLabelsAndValues, setSlot }) => {
    return (
        <>
            <Heading>What slot would you like to change to?</Heading>
            <DropdownListInput
                selectLabelId="packing-slot-select-label"
                labelsAndValues={packingSlotsLabelsAndValues}
                listTitle="Packing Slot"
                defaultValue=""
                onChange={(event) => {
                    setSlot(event.target.value);
                }}
            />
        </>
    );
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
        if (packingSlotsError) {
            setErrorMessage(
                `Failed to fetch packing slots data. Log Id: ${packingSlotsError.logId}`
            );
            setDisplayModal(false);
            return;
        }
        setPackingSlots(packingSlotsData);
    })();

    const onSlotSubmit = async (): Promise<void> => {
        if (slot === "") {
            setWarningMessage("Please choose a valid packing slot.");
            return;
        }
        let packingSlotUpdateError: FetchParcelError | UpdateParcelError | null = null;
        for (const parcel of props.selectedParcels) {
            (async () => {
                const { error } = await packingDateOrSlotUpdate("packingSlot", slot, parcel);
                if (error) {
                    packingSlotUpdateError = error;
                    return;
                }
            })();
        }

        let newPackingSlotText: string = "";
        packingSlots.forEach((packingSlot) => {
            if (packingSlot[1] === slot) {
                newPackingSlotText = packingSlot[0];
            }
        }); //since 'slot' is the key for the packing slot, this algorithm is used to just recover the value, i.e. 'AM', 'PM, etc.

        const { error: statusUpdateError } = await props.updateParcelStatuses(
            props.selectedParcels,
            props.newStatus,
            `new packing slot: ${newPackingSlotText}`,
            "change packing slot"
        );
        if (packingSlotUpdateError) {
            setErrorMessage(getUpdateErrorMessage(packingSlotUpdateError));
        } else if (statusUpdateError) {
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
                        <Button variant="contained" onClick={onSlotSubmit}>
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
                        <SlotChangeInput
                            packingSlotsLabelsAndValues={packingSlots}
                            setSlot={setSlot}
                        />
                        <SelectedParcelsOverview
                            parcels={props.selectedParcels}
                            maxParcelsToShow={maxParcelsToShow}
                        />
                        <WarningMessage>{warningMessage}</WarningMessage>
                    </>
                ) : (
                    <></>
                )
            }
        />
    );
};

export default SlotChangeModal;
