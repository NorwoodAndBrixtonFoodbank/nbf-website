import styled, { useTheme } from "styled-components";
import { BABY_PRODUCTS_WIDTH } from "@/app/batch-create/columnWidths";
import { BatchActionType } from "@/app/batch-create/batchTypes";
import NappySizeInput from "@/app/batch-create/displayComponents/NappySizeInput";
import {
    ClearButton,
    BottomDiv,
    EditCellInputOptionButton,
} from "@/app/batch-create/displayComponents/EditCellStyledComponents";

const BabyProductsButtonDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

interface BabyProductsEditCellInputProps {
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    isOverride: boolean;
    isNappySizeInputOpen: boolean;
    initialNappySize: string | null;
}

const BabyProductsEditCellInput: React.FC<BabyProductsEditCellInputProps> = ({
    id,
    dispatchBatchTableAction,
    isOverride,
    isNappySizeInputOpen,
    initialNappySize,
}) => {
    const theme = useTheme();

    const babyProductValues: string[] = ["Yes", "No", "Don't Know"];

    return (
        <BabyProductsButtonDiv>
            {babyProductValues.map((value: string) => {
                return (
                    <EditCellInputOptionButton
                        width={BABY_PRODUCTS_WIDTH}
                        theme={theme}
                        key={value}
                        onClick={() =>
                            dispatchBatchTableAction({
                                type: "update_cell",
                                updateCellPayload: {
                                    rowId: id,
                                    newValueAndFieldName: {
                                        type: "client",
                                        fieldName: "babyProducts",
                                        newValue: value,
                                    },
                                },
                            })
                        }
                    >
                        {value}
                    </EditCellInputOptionButton>
                );
            })}
            {isNappySizeInputOpen && (
                <>
                    <NappySizeInput
                        id={id}
                        dispatchBatchTableAction={dispatchBatchTableAction}
                        initialNappySize={initialNappySize}
                    />
                    {!isOverride && (
                        // bottom div exists so that the nappy size input field doesn't activate the vertical overflow of the popover
                        <BottomDiv />
                    )}
                </>
            )}
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
                                    fieldName: "babyProducts",
                                    newValue: null,
                                },
                            },
                        })
                    }
                >
                    CLEAR
                </ClearButton>
            )}
        </BabyProductsButtonDiv>
    );
};

export default BabyProductsEditCellInput;
