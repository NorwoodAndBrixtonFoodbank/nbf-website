import { BatchActionType } from "@/app/batch-create/types";
import { BooleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { Checkbox } from "@mui/material";
import { clientBooleanGroupFields } from "@/app/batch-create/inputComponents/BooleanGroupEditCell";
import {
    BooleanGroupCheckBoxDiv,
    BooleanGroupCheckboxesDiv,
} from "@/app/batch-create/inputComponents/EditCellStyledComponents";

interface DietaryRequirementsEditCellProps {
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    isChecked: (key: string) => boolean;
    currentBooleanGroup: BooleanGroup;
    clientField: clientBooleanGroupFields;
    fieldWidth: number;
    booleanGroupLabelAndKeys: [string, string][];
}

const BooleanGroupEditCellInput: React.FC<DietaryRequirementsEditCellProps> = ({
    id,
    dispatchBatchTableAction,
    isChecked,
    currentBooleanGroup,
    clientField,
    fieldWidth,
    booleanGroupLabelAndKeys,
}) => {
    return (
        <BooleanGroupCheckboxesDiv width={fieldWidth}>
            {booleanGroupLabelAndKeys.map((booleanGroupLabelAndKey: [string, string]) => {
                const bGLabel: string = booleanGroupLabelAndKey[0];
                const bGKey: string = booleanGroupLabelAndKey[1];
                return (
                    <BooleanGroupCheckBoxDiv key={bGKey}>
                        <Checkbox
                            id={bGKey}
                            defaultChecked={isChecked(bGKey)}
                            value={isChecked(bGKey)}
                            onChange={() => {
                                currentBooleanGroup[bGKey] = !isChecked(bGKey);
                                dispatchBatchTableAction({
                                    type: "update_cell",
                                    updateCellPayload: {
                                        rowId: id,
                                        newValueAndFieldName: {
                                            type: "client",
                                            fieldName: clientField,
                                            newValue: currentBooleanGroup,
                                        },
                                    },
                                });
                            }}
                        />
                        <span>{bGLabel}</span>
                    </BooleanGroupCheckBoxDiv>
                );
            })}
        </BooleanGroupCheckboxesDiv>
    );
};

export default BooleanGroupEditCellInput;
