import { ParcelsTableRow } from "./types";

const getRowBoundaries = (columnValues: (string | number | null)[]): number[] => {
    let temp = columnValues[0];
    const boundaries: number[] = [];

    columnValues.forEach((columnValue, index) => {
        if (columnValue !== temp) {
            boundaries.push(index)
        }
        temp = columnValue;
    })
    
    return boundaries;
};

const searchForPackingSlotBreakPoints = (parcelsTableRows: ParcelsTableRow[]): number[] => {
    const packingSlotValues = parcelsTableRows.map((row) => row.packingSlot);
    return getRowBoundaries(packingSlotValues);
};

const searchForPackingDateBreakPoints = (parcelsTableRows: ParcelsTableRow[]): number[] => {
    const packingSlotValues = parcelsTableRows.map((row) => row.packingDate?.getDate() ?? null);
    return getRowBoundaries(packingSlotValues);
};

export const searchForBreakPoints = (
    sortField: string,
    parcelsTableRows: ParcelsTableRow[]
): number[][] => {
    switch (sortField) {
        case "packingSlot":
            return [searchForPackingSlotBreakPoints(parcelsTableRows),[]];
        case "packingDate":
            return [searchForPackingDateBreakPoints(parcelsTableRows), searchForPackingSlotBreakPoints(parcelsTableRows)];
        default:
            return [[],[]];
    }
};
