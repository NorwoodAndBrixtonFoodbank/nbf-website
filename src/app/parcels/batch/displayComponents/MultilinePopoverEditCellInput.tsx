import { BatchActionType } from "@/app/parcels/batch/batchTypes";
import { MultilinePopoverField } from "@/app/parcels/batch/displayComponents/MultilinePopoverEditCell";
import MultilinePopoverInputField from "@/app/parcels/batch/displayComponents/MultilinePopoverInputField";

interface MultilinePopoverEditCellInputProps {
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    initialText: string;
    multilinePopoverField: MultilinePopoverField;
}

const MultilinePopoverEditCellInput: React.FC<MultilinePopoverEditCellInputProps> = ({
    id,
    dispatchBatchTableAction,
    initialText,
    multilinePopoverField,
}) => {
    return (
        <MultilinePopoverInputField
            id={id}
            dispatchBatchTableAction={dispatchBatchTableAction}
            initialText={initialText}
            multilinePopoverField={multilinePopoverField}
        />
    );
};

export default MultilinePopoverEditCellInput;
