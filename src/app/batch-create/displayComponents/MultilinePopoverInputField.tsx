import { useEffect, useRef, useState } from "react";
import { BatchActionType } from "@/app/batch-create/batchTypes";
import { MultilinePopoverField } from "@/app/batch-create/displayComponents/MultilinePopoverEditCell";
import { MultiLineTextField } from "@/app/batch-create/displayComponents/EditCellStyledComponents";

interface MultilinePopoverInputFieldProps {
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    initialText: string;
    multilinePopoverField: MultilinePopoverField;
    maxCharacters: number;
}

const MultilinePopoverInputField: React.FC<MultilinePopoverInputFieldProps> = ({
    id,
    dispatchBatchTableAction,
    initialText,
    multilinePopoverField,
    maxCharacters
}) => {
    const [value, setValue] = useState(initialText);
    const isError = value.length > maxCharacters;
    const MultilinePopoverInputFieldFocusRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        MultilinePopoverInputFieldFocusRef.current?.focus();
    }, []);

    return (
        <MultiLineTextField
            multiline
            rows={6}
            inputRef={MultilinePopoverInputFieldFocusRef}
            value={value}
            error={isError}
            helperText={isError ? `Max characters: ${maxCharacters}` : ""}
            onChange={(event) => {
                setValue(event.target.value);
                if (event.target.value.length <= maxCharacters) {
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
                    });
                }
            }
            }
        />
    );
};

export default MultilinePopoverInputField;
