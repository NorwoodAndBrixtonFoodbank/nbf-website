import { BatchActionType } from "@/app/parcels/batch/batchTypes";
import styled from "styled-components";
import { BOOLEAN_CLIENT_WIDTH } from "@/app/parcels/batch/columnWidths";
import { BooleanClientField } from "@/app/parcels/batch/displayComponents/BooleanClientEditCell";
import {
    ClearButton,
    EditCellInputOptionButton,
} from "@/app/parcels/batch/displayComponents/EditCellStyledComponents";

const BooleanClientButtonDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

interface BooleanClientEditCellInputProps {
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    labelAndValues: [string, boolean][];
    field: BooleanClientField;
}

const BooleanClientEditCellInput: React.FC<BooleanClientEditCellInputProps> = ({
    id,
    dispatchBatchTableAction,
    labelAndValues,
    field,
}) => {
    return (
        <BooleanClientButtonDiv>
            {labelAndValues.map((labelAndValue) => {
                return (
                    <EditCellInputOptionButton
                        width={BOOLEAN_CLIENT_WIDTH}
                        key={labelAndValue[0]}
                        onClick={() =>
                            dispatchBatchTableAction({
                                type: "update_cell",
                                updateCellPayload: {
                                    rowId: id,
                                    newValueAndFieldName: {
                                        type: "client",
                                        fieldName: field,
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
            {id === 0 && (
                <ClearButton
                    variant="outlined"
                    onClick={() =>
                        dispatchBatchTableAction({
                            type: "update_cell",
                            updateCellPayload: {
                                rowId: id,
                                newValueAndFieldName: {
                                    type: "client",
                                    fieldName: field,
                                    newValue: null,
                                },
                            },
                        })
                    }
                >
                    CLEAR
                </ClearButton>
            )}
        </BooleanClientButtonDiv>
    );
};

export default BooleanClientEditCellInput;