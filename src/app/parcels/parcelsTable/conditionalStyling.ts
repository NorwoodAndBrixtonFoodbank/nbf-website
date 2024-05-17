import { ParcelsTableRow } from "./types";

const getRowBoundaries = (columnValues: (string | number | null)[]): number[] => {
    const setOfDistinctColumnValues = new Set(columnValues);

    const boundaries: number[] = [];
    setOfDistinctColumnValues.forEach((columnValue) => {
        if (columnValue === columnValues[0]) {
            return;
        }

        const indexOfFirstOccurrence = columnValues.indexOf(columnValue);
        boundaries.push(indexOfFirstOccurrence);
    });
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
): number[] => {
    switch (sortField) {
        case "packingSlot":
            return searchForPackingSlotBreakPoints(parcelsTableRows);
        case "packingDate":
            return searchForPackingDateBreakPoints(parcelsTableRows);
        default:
            return [];
    }
};
