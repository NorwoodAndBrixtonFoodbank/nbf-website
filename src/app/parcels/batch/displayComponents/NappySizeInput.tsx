import { Divider } from "@mui/material";
import { BatchActionType } from "@/app/parcels/batch/batchTypes";
import { useEffect, useRef } from "react";
import {
    EditCellInputLabel,
    EditCellTextField,
} from "@/app/parcels/batch/displayComponents/EditCellStyledComponents";
import { BABY_PRODUCTS_WIDTH } from "@/app/parcels/batch/columnWidths";

interface NappySizeInputProps {
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    initialNappySize: string | null;
}

const NappySizeInput: React.FC<NappySizeInputProps> = ({
    id,
    dispatchBatchTableAction,
    initialNappySize,
}) => {
    const nappySizeInputFocusRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        nappySizeInputFocusRef.current?.focus();
    }, []);

    return (
        <>
            <Divider variant="middle" />
            <EditCellInputLabel>Nappy size:</EditCellInputLabel>
            <EditCellTextField
                width={BABY_PRODUCTS_WIDTH}
                inputRef={nappySizeInputFocusRef}
                defaultValue={initialNappySize ?? ""}
                onChange={(event) =>
                    dispatchBatchTableAction({
                        type: "update_cell",
                        updateCellPayload: {
                            rowId: id,
                            newValueAndFieldName: {
                                type: "client",
                                fieldName: "nappySize",
                                newValue: event.target.value,
                            },
                        },
                    })
                }
            />
        </>
    );
};

export default NappySizeInput;
