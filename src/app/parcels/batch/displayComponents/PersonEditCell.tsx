import { GridRenderCellParams } from "@mui/x-data-grid";
import { useCallback } from "react";
import {
    AdultInfo,
    BatchActionType,
    BatchTableDataState,
    ChildrenInfo,
} from "@/app/parcels/batch/batchTypes";
import EditCellPopover from "@/app/parcels/batch/displayComponents/EditCellPopover";
import PersonEditCellInput from "@/app/parcels/batch/displayComponents/PersonEditCellInput";
import { Person } from "@/components/Form/formFunctions";

export type PersonField = "adultInfo" | "childrenInfo";

interface PersonEditCellProps {
    gridRenderCellParams: GridRenderCellParams;
    tableState: BatchTableDataState;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    personField: PersonField;
}

const PersonEditCell: React.FC<PersonEditCellProps> = ({
    gridRenderCellParams,
    tableState,
    dispatchBatchTableAction,
    personField,
}) => {
    const id = gridRenderCellParams.id as number;

    const getCurrentPersonInfo = useCallback(
        (id: number): ChildrenInfo | AdultInfo | null => {
            return id === 0
                ? tableState.overrideDataRow.data.client[personField]
                : tableState.batchDataRows[id - 1].data.client[personField];
        },
        [tableState.batchDataRows, tableState.overrideDataRow.data.client, personField]
    );

    const getCurrentPersonArray = (id: number, personField: PersonField): Person[] => {
        const personInfo: ChildrenInfo | AdultInfo | null = getCurrentPersonInfo(id);
        if (!personInfo) {
            return [];
        }
        if (personField === "adultInfo") {
            const adultInfo = personInfo as AdultInfo;
            return adultInfo.adults;
        } else {
            const childrenInfo = personInfo as ChildrenInfo;
            return childrenInfo.children;
        }
    };

    const personArray = getCurrentPersonArray(id, personField);
    const personArrayLengthString: string = personArray.length === 0 ? "" : `${personArray.length}`;

    return (
        <EditCellPopover
            id={id}
            field={gridRenderCellParams.field}
            cellValueString={personArrayLengthString}
            dispatchBatchTableAction={dispatchBatchTableAction}
        >
            <PersonEditCellInput
                id={id}
                dispatchBatchTableAction={dispatchBatchTableAction}
                personArray={personArray}
                personField={personField}
            />
        </EditCellPopover>
    );
};

export default PersonEditCell;
