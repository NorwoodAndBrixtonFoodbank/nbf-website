import { GridRenderCellParams, useGridApiContext } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { BatchActionType, BatchTableDataState } from "@/app/parcels/batch/batchTypes";
import dayjs from "dayjs";
import { useMemo } from "react";

interface PackingDateEditCellProps {
    gridRenderCellParams: GridRenderCellParams;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    tableState: BatchTableDataState;
}

const PackingDateEditCell: React.FC<PackingDateEditCellProps> = ({
    gridRenderCellParams,
    dispatchBatchTableAction,
    tableState,
}) => {
    const id = gridRenderCellParams.id as number;
    const packingDateValueFormatted = useMemo(
        () =>
            id === 0
                ? tableState.overrideDataRow.data.parcel.packingDate
                : tableState.batchDataRows[id - 1].data.parcel.packingDate,
        [tableState.overrideDataRow.data.parcel.packingDate, tableState.batchDataRows, id]
    );
    const packingDateValue = packingDateValueFormatted
        ? dayjs(packingDateValueFormatted, "DD/MM/YYYY")
        : dayjs();
    const apiRef = useGridApiContext();

    const handleDatePickerChange = (value: dayjs.Dayjs | null): void => {
        dispatchBatchTableAction({
            type: "update_cell",
            updateCellPayload: {
                rowId: id,
                newValueAndFieldName: {
                    type: "parcel",
                    fieldName: "packingDate",
                    newValue: value?.format("DD/MM/YYYY") ?? "",
                },
            },
        });
        apiRef.current.setEditCellValue({
            id: id,
            field: "packingDate",
            value: value?.format("DD/MM/YYYY") ?? "",
        });
    };

    return (
        <DatePicker
            onChange={(value) => handleDatePickerChange(value)}
            defaultValue={packingDateValue}
            disablePast
        />
    );
};

export default PackingDateEditCell;
