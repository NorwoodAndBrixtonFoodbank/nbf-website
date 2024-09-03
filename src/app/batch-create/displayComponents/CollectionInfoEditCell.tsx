import { GridRenderCellParams } from "@mui/x-data-grid";
import { useCallback } from "react";
import {
    BatchActionType,
    BatchTableDataState,
    CollectionInfo,
} from "@/app/batch-create/batchTypes";
import { collectionInfoToString } from "@/app/batch-create/displayHelpers";
import EditCellPopover from "@/app/batch-create/displayComponents/EditCellPopover";
import CollectionInfoEditCellInput from "@/app/batch-create/displayComponents/CollectionInfoEditCellInput";

export interface GridRenderAddressCellParams extends GridRenderCellParams {
    id: number;
}
interface CollectionInfoEditCellProps {
    gridRenderCellParams: GridRenderCellParams;
    tableState: BatchTableDataState;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    isRowCollection: { [key: number]: boolean };
    setIsRowCollection: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
}

const CollectionInfoEditCell: React.FC<CollectionInfoEditCellProps> = ({
    gridRenderCellParams,
    tableState,
    dispatchBatchTableAction,
    isRowCollection,
    setIsRowCollection,
}) => {
    const id = gridRenderCellParams.id as number;

    const getCurrentRowCollectionInfo = useCallback(
        (id: number): CollectionInfo | null => {
            return id === 0
                ? tableState.overrideDataRow.data.parcel.collectionInfo
                : tableState.batchDataRows[id - 1].data.parcel.collectionInfo;
        },
        [tableState.batchDataRows, tableState.overrideDataRow.data.parcel.collectionInfo]
    );

    return (
        <EditCellPopover
            id={id}
            field={gridRenderCellParams.field}
            cellValueString={collectionInfoToString(getCurrentRowCollectionInfo(id))}
            dispatchBatchTableAction={dispatchBatchTableAction}
        >
            <CollectionInfoEditCellInput
                id={id}
                dispatchBatchTableAction={dispatchBatchTableAction}
                currentCollectionInfo={getCurrentRowCollectionInfo(id)}
                isRowCollection={isRowCollection}
                setIsRowCollection={setIsRowCollection}
                tableState={tableState}
            />
        </EditCellPopover>
    );
};

export default CollectionInfoEditCell;
