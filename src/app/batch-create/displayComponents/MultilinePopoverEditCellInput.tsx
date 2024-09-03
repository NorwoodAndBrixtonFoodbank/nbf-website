import { BatchActionType } from "@/app/batch-create/batchTypes";
import { MultilinePopoverField } from "@/app/batch-create/displayComponents/MultilinePopoverEditCell";
import MultilinePopoverInputField from "@/app/batch-create/displayComponents/MultilinePopoverInputField";

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
