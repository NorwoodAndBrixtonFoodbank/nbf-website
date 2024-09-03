import { BatchActionType } from "@/app/batch-create/batchTypes";
import { useTheme } from "styled-components";
import { SHIPPING_METHOD_LABELS_AND_VALUES } from "@/app/parcels/form/formSections/ShippingMethodCard";
import { SHIPPING_METHOD_WIDTH } from "@/app/batch-create/columnWidths";
import {
    ClearButton,
    EditCellButtonDiv,
    EditCellInputOptionButton,
} from "@/app/batch-create/displayComponents/EditCellStyledComponents";

interface ShippingMethodEditCellInputProps {
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    setIsRowCollection: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
}

const ShippingMethodEditCellInput: React.FC<ShippingMethodEditCellInputProps> = ({
    id,
    dispatchBatchTableAction,
    setIsRowCollection,
}) => {
    const theme = useTheme();

    const handleEditCellOnClick = (value: string): void => {
        dispatchBatchTableAction({
            type: "update_cell",
            updateCellPayload: {
                rowId: id,
                newValueAndFieldName: {
                    type: "parcel",
                    fieldName: "shippingMethod",
                    newValue: value,
                },
            },
        });
        setIsRowCollection((isRowCollection) => {
            const newIsRowCollection = { ...isRowCollection };
            newIsRowCollection[id] = value === "Collection";
            return newIsRowCollection;
        });
    };

    return (
        <EditCellButtonDiv>
            {SHIPPING_METHOD_LABELS_AND_VALUES.map((labelAndValue) => {
                return (
                    <EditCellInputOptionButton
                        width={SHIPPING_METHOD_WIDTH}
                        theme={theme}
                        key={labelAndValue[1]}
                        onClick={() => handleEditCellOnClick(labelAndValue[1])}
                    >
                        {labelAndValue[0]}
                    </EditCellInputOptionButton>
                );
            })}
            {id === 0 && (
                <ClearButton
                    variant="outlined"
                    onClick={() => {
                        dispatchBatchTableAction({
                            type: "update_cell",
                            updateCellPayload: {
                                rowId: id,
                                newValueAndFieldName: {
                                    type: "parcel",
                                    fieldName: "shippingMethod",
                                    newValue: null,
                                },
                            },
                        });
                    }}
                >
                    CLEAR
                </ClearButton>
            )}
        </EditCellButtonDiv>
    );
};

export default ShippingMethodEditCellInput;
