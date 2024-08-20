import BatchParcelDataGrid from "@/app/parcels/batch/displayComponents/BatchParcelDataGrid";
import getCenteredBatchGridDisplayColumns from "@/app/parcels/batch/getCenteredBatchGridDisplayColumns";
import { mockTableDataState } from "@/app/parcels/batch/mockData";
import { writeLocalTableState } from "@/app/parcels/batch/useLocalStorage";
import { BatchActionType } from "../batchTypes";
import { Dispatch } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/app/themes";

const ThemeProvidedBatchParcelDataGrid: React.FC = () => {
    return (
        <ThemeProvider theme={lightTheme}>
            <BatchParcelDataGrid />
        </ThemeProvider>
    );
};

const expectedDisplayRows = [
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    [
        1,
        "John Doe",
        "0123456789",
        "123 Main St, Anytown, USA, 12345",
        0,
        0,
        "hotel",
        "vegan",
        "",
        "",
        "",
        "",
        "Leave at 10 am",
        "No special requests",
        "Yes",
        "No",
        "",
        "",
        "",
        "",
        "",
        "",
    ],
    [
        2,
        "Jane Smiths",
        "9876543210",
        "456 Elm St, Anytown, USA, 54321",
        0,
        0,
        "regular",
        "gluten-free",
        "tampons",
        "No",
        "cat",
        "",
        "Leave at 12 pm",
        "No special requests",
        "No",
        "Yes",
        "",
        "",
        "",
        "",
        "",
        "",
    ],
];

const mockDispatch: Dispatch<BatchActionType> = () => {
    return;
};

describe("BatchParcelDataGrid", () => {
    const batchGridDisplayColumns = getCenteredBatchGridDisplayColumns(
        mockTableDataState,
        mockDispatch
    );
    const columnWidths = batchGridDisplayColumns.map((column) => column.width) as number[];
    const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

    beforeEach(() => {
        cy.viewport(totalWidth + 50, 300);
        writeLocalTableState(mockTableDataState);
        cy.mount(<ThemeProvidedBatchParcelDataGrid />);
    });

    it("should display the expected column headers", () => {
        const headerNames = batchGridDisplayColumns.map((column) => column.headerName) as string[];
        cy.get(".MuiDataGrid-columnHeaderTitle").each((header, index) => {
            const headerText = header.text().trim();
            expect(headerText).to.equal(headerNames[index]);
        });
    });

    it("should display the expected data rows", () => {
        cy.get(".MuiDataGrid-virtualScrollerRenderZone")
            .children()
            .each(($row: JQuery<HTMLElement>, rowIndex: number) => {
                cy.wrap($row)
                    .children()
                    .each(($item: JQuery<HTMLElement>, fieldIndex: number) => {
                        expectedDisplayRows[rowIndex][fieldIndex] &&
                            cy.wrap($item).contains(expectedDisplayRows[rowIndex][fieldIndex]);
                    });
            });
    });
});
