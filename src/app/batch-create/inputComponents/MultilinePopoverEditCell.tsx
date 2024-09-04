import { GridRenderCellParams } from "@mui/x-data-grid";
import { BatchActionType, BatchTableDataState } from "@/app/batch-create/types";
import EditCellPopover from "@/app/batch-create/inputComponents/EditCellPopover";
import MultilinePopoverInputField from "@/app/batch-create/inputComponents/MultilinePopoverInputField";
import { useMemo } from "react";

export type MultilinePopoverField = "deliveryInstructions" | "extraInformation" | "notes";

interface MultilinePopoverEditCellProps {
    gridRenderCellParams: GridRenderCellParams;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    tableState: BatchTableDataState;
    multilinePopoverField: MultilinePopoverField;
    maxCharacters?: number;
}

const MultilinePopoverEditCell: React.FC<MultilinePopoverEditCellProps> = ({
    gridRenderCellParams,
    dispatchBatchTableAction,
    tableState,
    multilinePopoverField,
    maxCharacters,
}) => {
    const id = gridRenderCellParams.id as number;

    const currentRowFieldData: string | null = useMemo(
        () =>
            id === 0
                ? tableState.overrideDataRow.data.client[multilinePopoverField]
                : tableState.batchDataRows[id - 1].data.client[multilinePopoverField],
        [
            tableState.overrideDataRow.data.client,
            tableState.batchDataRows,
            id,
            multilinePopoverField,
        ]
    );

    const currentRowFieldDataString: string = currentRowFieldData ?? "";

    return (
        <EditCellPopover
            id={id}
            field={multilinePopoverField}
            cellValueString={currentRowFieldDataString}
            dispatchBatchTableAction={dispatchBatchTableAction}
        >
            <MultilinePopoverInputField
                id={id}
                dispatchBatchTableAction={dispatchBatchTableAction}
                initialText={currentRowFieldDataString}
                multilinePopoverField={multilinePopoverField}
                maxCharacters={maxCharacters ?? 500}
            />
        </EditCellPopover>
    );
};

export default MultilinePopoverEditCell;
