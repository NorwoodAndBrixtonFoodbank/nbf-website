import { ActionsContainer, PreTableControlsContainer } from "@/components/Form/formStyling";
import { Button } from "@mui/material";
import ActionAndStatusBar from "../ActionBar/ActionAndStatusBar";
import { ParcelsTableRow } from "./types";
import { Dayjs } from "dayjs";
import { SaveParcelStatusResult, StatusType } from "../ActionBar/Statuses";

interface PreTableControlsProps {
    isPackingManagerView: boolean;
    setIsPackingManagerView: (isPackingManagerView: boolean) => void;
    selectedParcelMessage: string | null;
    getCheckedParcelsData: () => Promise<ParcelsTableRow[]>;
    updateParcelStatuses: (
        parcels: ParcelsTableRow[],
        newStatus: StatusType,
        statusEventData?: string,
        action?: string,
        date?: Dayjs
    ) => Promise<SaveParcelStatusResult>;
}

const PreTableControls: React.FC<PreTableControlsProps> = (props) => {
    return (
        <PreTableControlsContainer>
            <Button
                variant={props.isPackingManagerView ? "outlined" : "contained"}
                onClick={() => props.setIsPackingManagerView(false)}
            >
                All parcels
            </Button>
            <Button
                variant={props.isPackingManagerView ? "contained" : "outlined"}
                onClick={() => props.setIsPackingManagerView(true)}
            >
                Packing manager view
            </Button>
            {props.selectedParcelMessage && <span>{props.selectedParcelMessage}</span>}
            <ActionsContainer>
                <ActionAndStatusBar
                    fetchSelectedParcels={props.getCheckedParcelsData}
                    updateParcelStatuses={props.updateParcelStatuses}
                />
            </ActionsContainer>
        </PreTableControlsContainer>
    );
};

export default PreTableControls;
