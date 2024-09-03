import { capitaliseWords } from "@/common/format";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { BatchActionType, BatchTableDataState } from "@/app/batch-create/batchTypes";
import { useCallback } from "react";
import ListTypeEditCellInput from "@/app/batch-create/displayComponents/ListTypeEditCellInput";
import EditCellPopover from "@/app/batch-create/displayComponents/EditCellPopover";
interface ListTypeEditCellProps {
    gridRenderCellParams: GridRenderCellParams;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    tableState: BatchTableDataState;
}

const ListTypeEditCell: React.FC<ListTypeEditCellProps> = ({
    gridRenderCellParams,
    dispatchBatchTableAction,
    tableState,
}) => {
    const id = gridRenderCellParams.id as number;

    const getCurrentRowListType = useCallback(
        (id: number): string => {
            const currentRowListType =
                id === 0
                    ? tableState.overrideDataRow.data.client.listType
                    : tableState.batchDataRows[id - 1].data.client.listType;
            return currentRowListType ?? "";
        },
        [tableState.batchDataRows, tableState.overrideDataRow.data.client.listType]
    );

    const isOverride: boolean = id === 0;

    return (
        <EditCellPopover
            id={id}
            field={gridRenderCellParams.field}
            cellValueString={
                getCurrentRowListType(id) ? capitaliseWords(getCurrentRowListType(id)) : ""
            }
            dispatchBatchTableAction={dispatchBatchTableAction}
        >
            <ListTypeEditCellInput
                id={id}
                dispatchBatchTableAction={dispatchBatchTableAction}
                isOverride={isOverride}
            />
        </EditCellPopover>
    );
};

export default ListTypeEditCell;
