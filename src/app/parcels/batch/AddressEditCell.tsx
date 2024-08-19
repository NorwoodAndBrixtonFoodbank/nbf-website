import { Popover } from "@mui/material";
import { GridRenderCellParams, useGridApiContext } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { BatchActionType, BatchTableDataState } from "@/app/parcels/batch/BatchTypes";
import { addressToString } from "@/app/parcels/batch/displayHelpers";
import AddressEditCellInput from "@/app/parcels/batch/AddressEditCellInput";

export interface GridRenderAddressCellParams extends GridRenderCellParams {
    id: number;
}
interface AddressEditCellProps {
    gridRenderCellParams: GridRenderCellParams;
    tableState: BatchTableDataState;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
}

const AddressEditCell: React.FC<AddressEditCellProps> = ({
    gridRenderCellParams,
    tableState,
    dispatchBatchTableAction,
}) => {
    const id = gridRenderCellParams.id as number;
    const apiRef = useGridApiContext();
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(null);
    const gridCellReference = useRef<HTMLDivElement>(null);
    const open = popoverAnchorEl !== null;
    useEffect(() => {
        setPopoverAnchorEl(gridCellReference.current);
    }, []);

    //this keypress is to exit edit mode for the current cell. the built in method setCellMode is part of the pro version so this workaround is used instead
    const simulateEscapeKeyPress = (): void => {
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            key: "Escape",
        });
        if (gridCellReference.current) {
            gridCellReference.current.dispatchEvent(event);
        }
    };
    return (
        <div ref={gridCellReference}>
            <div>
                {addressToString(
                    id === 0
                        ? tableState.overrideDataRow.data.client.address
                        : tableState.batchDataRows[id - 1].data.client.address
                ) ?? ""}
            </div>
            <Popover
                open={open}
                onClose={() => {
                    apiRef.current.setEditCellValue({
                        id: id,
                        field: gridRenderCellParams.field,
                        value:
                            addressToString(
                                id === 0
                                    ? tableState.overrideDataRow.data.client.address
                                    : tableState.batchDataRows[id - 1].data.client.address
                            ) ?? "",
                    });
                    simulateEscapeKeyPress();
                }}
                anchorEl={popoverAnchorEl?.parentElement}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <AddressEditCellInput
                    tableState={tableState}
                    id={id}
                    dispatchBatchTableAction={dispatchBatchTableAction}
                    simulateEscapeKeyPress={simulateEscapeKeyPress}
                />
            </Popover>
        </div>
    );
};

export default AddressEditCell;
