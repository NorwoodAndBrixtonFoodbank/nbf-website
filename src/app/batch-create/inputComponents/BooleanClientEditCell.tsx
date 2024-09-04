import { GridRenderCellParams } from "@mui/x-data-grid";
import { BatchActionType, BatchTableDataState } from "@/app/batch-create/types";
import EditCellPopover from "@/app/batch-create/inputComponents/EditCellPopover";
import BooleanClientEditCellInput from "@/app/batch-create/inputComponents/BooleanClientEditCellInput";
import { useCallback } from "react";

export type BooleanClientField = "attentionFlag" | "signpostingCall";

interface BooleanClientEditCellProps {
    gridRenderCellParams: GridRenderCellParams;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    tableState: BatchTableDataState;
    field: BooleanClientField;
}

const BooleanClientEditCell: React.FC<BooleanClientEditCellProps> = ({
    gridRenderCellParams,
    dispatchBatchTableAction,
    tableState,
    field,
}) => {
    const id = gridRenderCellParams.id as number;
    const booleanClientLabelsAndValues: [string, boolean][] = [
        ["Yes", true],
        ["No", false],
    ];

    const getCurrentBooleanClientString = useCallback(
        (id: number, field: BooleanClientField): string => {
            return id === 0
                ? tableState.overrideDataRow.data.client[field]
                    ? "Yes"
                    : tableState.overrideDataRow.data.client[field] === false
                      ? "No"
                      : ""
                : tableState.batchDataRows[id - 1].data.client[field]
                  ? "Yes"
                  : tableState.batchDataRows[id - 1].data.client[field] === false
                    ? "No"
                    : "";
        },
        [tableState.batchDataRows, tableState.overrideDataRow.data.client]
    );

    return (
        <EditCellPopover
            id={id}
            field={field}
            cellValueString={getCurrentBooleanClientString(id, field)}
            dispatchBatchTableAction={dispatchBatchTableAction}
        >
            <BooleanClientEditCellInput
                id={id}
                dispatchBatchTableAction={dispatchBatchTableAction}
                labelAndValues={booleanClientLabelsAndValues}
                field={field}
            />
        </EditCellPopover>
    );
};

export default BooleanClientEditCell;
