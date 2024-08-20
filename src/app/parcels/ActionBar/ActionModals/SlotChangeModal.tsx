import React, { useState } from "react";
import GeneralActionModal, {
    ActionModalProps,
    Heading,
    WarningMessage,
    maxParcelsToShow,
} from "./GeneralActionModal";
import { Button } from "@mui/material";
import SelectedParcelsOverview from "../SelectedParcelsOverview";
import { getStatusErrorMessageWithLogId } from "../Statuses";
import supabase from "@/supabaseClient";
import { PackingSlotsLabelsAndValues, fetchPackingSlotsInfo } from "@/common/fetch";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { getUpdateErrorMessage, packingDateOrSlotUpdate } from "./CommonDateAndSlot";
import { ParcelsTableRow } from "@/app/parcels/parcelsTable/types";
import { ConfirmButtons } from "@/components/Buttons/GeneralButtonParts";

interface SlotInputProps {
    packingSlotsLabelsAndValues: PackingSlotsLabelsAndValues;
    setSlot: (slot: string) => void;
}

interface ContentProps {
    onClose: () => void;
    onSlotSubmit: () => void;
    packingSlots: [string, string][];
    setSlot: (slot: string) => void;
    selectedParcels: ParcelsTableRow[];
    warningMessage: string;
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
                focusOnDropdown={true}
            />
        </>
    );
};

const SlotChangeModalContent: React.FC<ContentProps> = ({
    packingSlots,
    setSlot,
    selectedParcels,
    warningMessage,
    onClose,
    onSlotSubmit,
}) => {
    return (
        <>
            <SlotChangeInput packingSlotsLabelsAndValues={packingSlots} setSlot={setSlot} />
            <SelectedParcelsOverview
                parcels={selectedParcels}
                maxParcelsToShow={maxParcelsToShow}
            />
            <WarningMessage>{warningMessage}</WarningMessage>
            <ConfirmButtons>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={onSlotSubmit}>
                    Change
                </Button>
            </ConfirmButtons>
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
        const packingSlotUpdateErrors = await Promise.all(
            props.selectedParcels.map((parcel) => {
                return packingDateOrSlotUpdate("packingSlot", slot, parcel);
            })
        );

        const newPackingSlotText: string =
            packingSlots.find((packingSlot) => packingSlot[1] === slot)?.at(0) ?? "";

        const { error: statusUpdateError } = await props.updateParcelStatuses(
            props.selectedParcels,
            "Packing Slot Changed",
            `new packing slot: ${newPackingSlotText}`,
            "change packing slot"
        );
        if (
            !packingSlotUpdateErrors.every(
                (packingSlotUpdateError) => packingSlotUpdateError.error === null
            )
        ) {
            setErrorMessage(
                packingSlotUpdateErrors
                    .map((packingSlotUpdateError) => getUpdateErrorMessage(packingSlotUpdateError))
                    .join("")
            );
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
        >
            {!actionCompleted && displayModal && (
                <SlotChangeModalContent
                    packingSlots={packingSlots}
                    setSlot={setSlot}
                    selectedParcels={props.selectedParcels}
                    warningMessage={warningMessage}
                    onClose={onClose}
                    onSlotSubmit={onSlotSubmit}
                />
            )}
        </GeneralActionModal>
    );
};

export default SlotChangeModal;
