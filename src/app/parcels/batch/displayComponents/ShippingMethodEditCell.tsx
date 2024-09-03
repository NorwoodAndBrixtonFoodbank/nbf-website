import { GridRenderCellParams } from "@mui/x-data-grid";
import { BatchActionType, BatchTableDataState } from "@/app/parcels/batch/batchTypes";
import EditCellPopover from "@/app/parcels/batch/displayComponents/EditCellPopover";
import ShippingMethodEditCellInput from "@/app/parcels/batch/displayComponents/ShippingMethodEditCellInput";

interface ShippingMethodEditCellProps {
    gridRenderCellParams: GridRenderCellParams;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    tableState: BatchTableDataState;
    setIsRowCollection: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
}

export const getCurrentShippingMethodString = (
    id: number,
    tableState: BatchTableDataState
): string => {
    return id === 0
        ? tableState.overrideDataRow.data.parcel.shippingMethod ?? ""
        : tableState.batchDataRows[id - 1].data.parcel.shippingMethod ?? "";
};

const ShippingMethodEditCell: React.FC<ShippingMethodEditCellProps> = ({
    gridRenderCellParams,
    dispatchBatchTableAction,
    tableState,
    setIsRowCollection,
}) => {
    const id = gridRenderCellParams.id as number;

    return (
        <EditCellPopover
            id={id}
            field="shippingMethod"
            cellValueString={getCurrentShippingMethodString(id, tableState)}
            dispatchBatchTableAction={dispatchBatchTableAction}
        >
            <ShippingMethodEditCellInput
                id={id}
                dispatchBatchTableAction={dispatchBatchTableAction}
                setIsRowCollection={setIsRowCollection}
            />
        </EditCellPopover>
    );
};

export default ShippingMethodEditCell;
