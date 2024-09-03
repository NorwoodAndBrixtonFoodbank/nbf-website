import { BatchActionType } from "@/app/parcels/batch/batchTypes";
import { useTheme } from "styled-components";
import { PACKING_SLOT_WIDTH } from "@/app/parcels/batch/columnWidths";
import { fetchPackingSlots } from "@/app/admin/packingSlotsTable/PackingSlotActions";
import { PackingSlotRow } from "@/app/admin/packingSlotsTable/PackingSlotsTable";
import { useEffect, useState } from "react";
import {
    ClearButton,
    EditCellButtonDiv,
    EditCellInputOptionButton,
} from "@/app/parcels/batch/displayComponents/EditCellStyledComponents";

interface PackingSlotEditCellInputProps {
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
}

const PackingSlotEditCellInput: React.FC<PackingSlotEditCellInputProps> = ({
    id,
    dispatchBatchTableAction,
}) => {
    const theme = useTheme();
    const [packingSlots, setPackingSlots] = useState<PackingSlotRow[]>([]);
    useEffect(() => {
        const setPackingSlotsEffect = async (): Promise<void> => {
            const packingSlots: PackingSlotRow[] = await fetchPackingSlots();
            setPackingSlots(packingSlots);
        };
        setPackingSlotsEffect();
    }, []);

    const shownPackingSlotNamesAndIds: { name: string; packingSlotId: string }[] = packingSlots
        .filter((packingSlot: PackingSlotRow) => {
            return packingSlot.isShown;
        })
        .map((packingSlot: PackingSlotRow) => {
            return { name: packingSlot.name, packingSlotId: packingSlot.id };
        });

    return (
        <EditCellButtonDiv>
            {shownPackingSlotNamesAndIds.map(({ name, packingSlotId }) => {
                return (
                    <EditCellInputOptionButton
                        width={PACKING_SLOT_WIDTH}
                        theme={theme}
                        key={packingSlotId}
                        onClick={() =>
                            dispatchBatchTableAction({
                                type: "update_cell",
                                updateCellPayload: {
                                    rowId: id,
                                    newValueAndFieldName: {
                                        type: "parcel",
                                        fieldName: "packingSlot",
                                        newValue: name,
                                    },
                                },
                            })
                        }
                    >
                        {name}
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
                                    type: "parcel",
                                    fieldName: "packingSlot",
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

export default PackingSlotEditCellInput;
