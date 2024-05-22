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
    name: string;
    breakPoints: number[];
    colour: string;
    thickness: string;
};

export const searchForBreakPoints = <TableRow extends ParcelsTableRow>(
    headerKey: keyof TableRow,
    parcelsTableRows: TableRow[],
    theme: DefaultTheme
): BreakPointConfig[] => {
    switch (headerKey) {
        case "packingSlot": {
            return [{
                name: "packingSlot",
                breakPoints: searchForPackingSlotBreakPoints(parcelsTableRows),
                colour: theme.primary.background[3],
                thickness: "5pt",
            }];
        }
        case "packingDate": {
            return [{
                name: "packingSlot",
                breakPoints: searchForPackingSlotBreakPoints(parcelsTableRows),
                colour: theme.primary.background[2],
                thickness: "2.5pt",
            }, 
            {
                name: "packingDate",
                breakPoints: searchForPackingDateBreakPoints(parcelsTableRows),
                colour: theme.primary.background[3],
                thickness: "5pt",
            }];
        }
        default:
            return [];
    }
};
