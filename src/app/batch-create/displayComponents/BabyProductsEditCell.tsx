import { GridRenderCellParams } from "@mui/x-data-grid";
import {
    BatchActionType,
    BatchClient,
    BatchTableDataState,
    OverrideClient,
} from "@/app/batch-create/batchTypes";
import { useCallback } from "react";
import EditCellPopover from "@/app/batch-create/displayComponents/EditCellPopover";
import BabyProductsEditCellInput from "@/app/batch-create/displayComponents/BabyProductsEditCellInput";

interface BabyProductsEditCellProps {
    gridRenderCellParams: GridRenderCellParams;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    tableState: BatchTableDataState;
}

const BabyProductsEditCell: React.FC<BabyProductsEditCellProps> = ({
    gridRenderCellParams,
    dispatchBatchTableAction,
    tableState,
}) => {
    const id = gridRenderCellParams.id as number;

    const getCurrentRowClientData = useCallback(
        (id: number): OverrideClient | BatchClient => {
            return id === 0
                ? tableState.overrideDataRow.data.client
                : tableState.batchDataRows[id - 1].data.client;
        },
        [tableState.batchDataRows, tableState.overrideDataRow.data.client]
    );

    const getCurrentRowBabyProductsString = useCallback(
        (id: number): string => {
            const currentRowClient = getCurrentRowClientData(id);
            if (currentRowClient.babyProducts === "Yes") {
                return `Yes${currentRowClient.nappySize ? ", Nappy Size: " + currentRowClient.nappySize : ""}`;
            } else {
                return currentRowClient.babyProducts ?? "";
            }
        },
        [getCurrentRowClientData]
    );

    const isOverride: boolean = id === 0;
    const currentRowClientData = getCurrentRowClientData(id);
    const isNappySizeInputOpen: boolean = currentRowClientData.babyProducts === "Yes";

    return (
        <EditCellPopover
            id={id}
            field={gridRenderCellParams.field}
            cellValueString={getCurrentRowBabyProductsString(id)}
            dispatchBatchTableAction={dispatchBatchTableAction}
        >
            <BabyProductsEditCellInput
                id={id}
                dispatchBatchTableAction={dispatchBatchTableAction}
                isOverride={isOverride}
                isNappySizeInputOpen={isNappySizeInputOpen}
                initialNappySize={currentRowClientData.nappySize}
            />
        </EditCellPopover>
    );
};

export default BabyProductsEditCell;
