import { GridRenderCellParams } from "@mui/x-data-grid";
import { BatchActionType, BatchTableDataState } from "@/app/batch-create/types";
import EditCellPopover from "@/app/batch-create/inputComponents/EditCellPopover";
import PackingSlotEditCellInput from "@/app/batch-create/inputComponents/PackingSlotEditCellInput";
import { useMemo } from "react";

interface PackingSlotEditCellProps {
    gridRenderCellParams: GridRenderCellParams;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    tableState: BatchTableDataState;
}

const PackingSlotEditCell: React.FC<PackingSlotEditCellProps> = ({
    gridRenderCellParams,
    dispatchBatchTableAction,
    tableState,
}) => {
    const id = gridRenderCellParams.id as number;

    const packingSlot = useMemo(
        () =>
            id === 0
                ? tableState.overrideDataRow.data.parcel.packingSlot
                : tableState.batchDataRows[id - 1].data.parcel.packingSlot,
        [tableState.overrideDataRow.data.parcel.packingSlot, tableState.batchDataRows, id]
    );

    return (
        <EditCellPopover
            id={id}
            field="packingSlot"
            cellValueString={packingSlot ?? ""}
            dispatchBatchTableAction={dispatchBatchTableAction}
        >
            <PackingSlotEditCellInput id={id} dispatchBatchTableAction={dispatchBatchTableAction} />
        </EditCellPopover>
    );
};

export default PackingSlotEditCell;
