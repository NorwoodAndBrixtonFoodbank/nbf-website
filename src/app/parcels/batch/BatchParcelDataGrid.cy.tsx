import BatchParcelDataGrid, {
    BatchGridDisplayRow,
    batchGridDisplayColumns,
} from "@/app/parcels/batch/BatchParcelDataGrid";
import { mockDisplayData } from "./mockData";
describe("BatchParcelDataGrid", () => {
    const fieldNames: string[] = batchGridDisplayColumns.map((column) => column.field);
    const columnWidths = batchGridDisplayColumns.map((column) => column.width) as number[];
    const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

    beforeEach(() => {
        cy.viewport(totalWidth + 50, 300);
        cy.mount(<BatchParcelDataGrid rows={mockDisplayData} />);
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
                        const fieldName = fieldNames[fieldIndex] as keyof BatchGridDisplayRow;
                        mockDisplayData[rowIndex][fieldName] &&
                            cy.wrap($item).contains(mockDisplayData[rowIndex][fieldName]);
                    });
            });
    });
});
