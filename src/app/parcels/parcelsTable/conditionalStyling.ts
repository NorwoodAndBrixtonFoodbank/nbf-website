import { DefaultTheme } from "styled-components/dist/types";
import { ParcelsTableRow } from "./types";
import { BreakPointConfig } from "@/components/Tables/Table";

const getRowBoundaries = (columnValues: (string | number | null)[]): number[] => {
    const boundaries: number[] = [];

    columnValues.forEach((columnValue, index) => {
        const previousIndex = index - 1 >= 0 ? index - 1 : 0;
        const previousValue = columnValues[previousIndex];
        if (columnValue !== previousValue) {
            boundaries.push(index);
        }
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
    headerKey: keyof ParcelsTableRow,
    parcelsTableRows: ParcelsTableRow[],
    theme: DefaultTheme
): BreakPointConfig[] => {
    switch (headerKey) {
        case "packingSlot": {
            return [
                {
                    name: "packingSlot",
                    breakPoints: searchForPackingSlotBreakPoints(parcelsTableRows),
                    colour: theme.primary.background[3],
                    thickness: "5pt",
                },
            ];
        }
        case "packingDate": {
            return [
                {
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
                },
            ];
        }
        default:
            return [];
    }
};
