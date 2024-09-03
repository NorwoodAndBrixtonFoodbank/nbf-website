import { useEffect, useRef } from "react";
import { BatchActionType } from "@/app/parcels/batch/batchTypes";
import { MultilinePopoverField } from "@/app/parcels/batch/displayComponents/MultilinePopoverEditCell";
import { MultiLineTextField } from "@/app/parcels/batch/displayComponents/EditCellStyledComponents";
interface MultilinePopoverInputFieldProps {
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    initialText: string;
    multilinePopoverField: MultilinePopoverField;
}
const MultilinePopoverInputField: React.FC<MultilinePopoverInputFieldProps> = ({
    id,
    dispatchBatchTableAction,
    initialText,
    multilinePopoverField,
}) => {
    const MultilinePopoverInputFieldFocusRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        MultilinePopoverInputFieldFocusRef.current?.focus();
    }, []);

    return (
        <MultiLineTextField
            multiline
            rows={6}
            inputRef={MultilinePopoverInputFieldFocusRef}
            defaultValue={initialText}
            onChange={(event) =>
                dispatchBatchTableAction({
                    type: "update_cell",
                    updateCellPayload: {
                        rowId: id,
                        newValueAndFieldName: {
                            type: "client",
                            fieldName: multilinePopoverField,
                            newValue: event.target.value,
                        },
                    },
                })
            }
        />
    );
};

export default MultilinePopoverInputField;
