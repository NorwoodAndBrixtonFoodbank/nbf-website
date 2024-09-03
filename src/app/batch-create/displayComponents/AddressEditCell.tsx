import { GridRenderCellParams } from "@mui/x-data-grid";
import { useCallback } from "react";
import { BatchActionType, BatchTableDataState } from "@/app/batch-create/batchTypes";
import { addressToString } from "@/app/batch-create/displayHelpers";
import AddressEditCellInput from "@/app/batch-create/displayComponents/AddressEditCellInput";
import EditCellPopover from "@/app/batch-create/displayComponents/EditCellPopover";

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
    // cast is safe as BatchDataRow and OverrideDataRow id property is always a number not a string
    const id = gridRenderCellParams.id as number;

    const getCurrentRowAddressString = useCallback(
        (id: number): string => {
            const currentRowAddress =
                id === 0
                    ? tableState.overrideDataRow.data.client.address
                    : tableState.batchDataRows[id - 1].data.client.address;
            return addressToString(currentRowAddress) ?? "";
        },
        [tableState.batchDataRows, tableState.overrideDataRow.data.client.address]
    );

    return (
        <EditCellPopover
            id={id}
            field={gridRenderCellParams.field}
            cellValueString={getCurrentRowAddressString(id)}
            dispatchBatchTableAction={dispatchBatchTableAction}
        >
            <AddressEditCellInput
                tableState={tableState}
                id={id}
                dispatchBatchTableAction={dispatchBatchTableAction}
            />
        </EditCellPopover>
    );
};

export default AddressEditCell;
