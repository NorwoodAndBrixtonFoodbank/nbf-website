import { LIST_TYPES_ARRAY, ListTypeLabelsAndValues } from "@/common/fetch";
import { capitaliseWords } from "@/common/format";
import { BatchActionType } from "@/app/parcels/batch/batchTypes";
import {
    ClearButton,
    EditCellButtonDiv,
    EditCellInputOptionButton,
} from "@/app/parcels/batch/displayComponents/EditCellStyledComponents";
import { LIST_TYPE_WIDTH } from "@/app/parcels/batch/columnWidths";
import { useTheme } from "styled-components";

interface ListTypeEditCellInputProps {
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    isOverride: boolean;
}

const ListTypeEditCellInput: React.FC<ListTypeEditCellInputProps> = ({
    id,
    dispatchBatchTableAction,
    isOverride,
}) => {
    const theme = useTheme();

    const listTypeLabelsAndValues: ListTypeLabelsAndValues = LIST_TYPES_ARRAY.map((listType) => [
        capitaliseWords(listType),
        listType,
    ]);

    return (
        <EditCellButtonDiv>
            {listTypeLabelsAndValues.map((labelAndValue: [string, string]) => {
                return (
                    <EditCellInputOptionButton
                        width={LIST_TYPE_WIDTH}
                        theme={theme}
                        key={labelAndValue[0]}
                        onClick={() =>
                            dispatchBatchTableAction({
                                type: "update_cell",
                                updateCellPayload: {
                                    rowId: id,
                                    newValueAndFieldName: {
                                        type: "client",
                                        fieldName: "listType",
                                        newValue: labelAndValue[1],
                                    },
                                },
                            })
                        }
                    >
                        {labelAndValue[0]}
                    </EditCellInputOptionButton>
                );
            })}
            {isOverride && (
                <ClearButton
                    variant="outlined"
                    onClick={() =>
                        dispatchBatchTableAction({
                            type: "update_cell",
                            updateCellPayload: {
                                rowId: id,
                                newValueAndFieldName: {
                                    type: "client",
                                    fieldName: "listType",
                                    newValue: null,
                                },
                            },
                        })
                    }
                >
                    CLEAR
                </ClearButton>
            )}
        </EditCellButtonDiv>
    );
};

export default ListTypeEditCellInput;
