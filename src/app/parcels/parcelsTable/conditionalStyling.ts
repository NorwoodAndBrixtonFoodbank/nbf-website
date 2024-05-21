import { DefaultTheme } from "styled-components/dist/types";
import { ParcelsTableRow } from "./types";

const getRowBoundaries = (columnValues: (string | number | null)[]): number[] => {
    let temp = columnValues[0];
    const boundaries: number[] = [];

    columnValues.forEach((columnValue, index) => {
        if (columnValue !== temp) {
            boundaries.push(index);
        }
        temp = columnValue;
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

export type BreakPointConfig = {
    name: string
    breakPoints: number[]
    colour: string
    thickness?: string
}

export const searchForBreakPoints = (
    sortField: string,
    parcelsTableRows: ParcelsTableRow[],
    theme: DefaultTheme,
): BreakPointConfig[] => {
    switch (sortField) {
        case "packingSlot": {
            let packingSlotBreakPointConfig = {
                name: "packingSlot",
                breakPoints: searchForPackingSlotBreakPoints(parcelsTableRows),
                colour: theme.primary.background[3],
                thickness: "5pt"
            }
            return [packingSlotBreakPointConfig];
        }
        case "packingDate": {
            let packingSlotBreakPointConfig = {
                name: "packingSlot",
                breakPoints: searchForPackingSlotBreakPoints(parcelsTableRows),
                colour: theme.primary.background[2],
                thickness: "2.5pt"
            }
            let packingDateBreakPointConfig = {
                name: "packingDate",
                breakPoints: searchForPackingDateBreakPoints(parcelsTableRows),
                colour: theme.primary.background[3],
                thickness: "5pt"
            }
            return [
                packingSlotBreakPointConfig,
                packingDateBreakPointConfig,
            ];
        }
        default:
            return [];
    }
};
