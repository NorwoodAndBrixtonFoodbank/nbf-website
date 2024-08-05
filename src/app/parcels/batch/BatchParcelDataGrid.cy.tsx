import BatchParcelDataGrid, {
    batchGridDisplayColumns,
} from "@/app/parcels/batch/BatchParcelDataGrid";
import mockData from "./mockData";
describe("BatchParcelDataGrid", () => {
    it("should display the expected column headers", () => {
        const headerNames = batchGridDisplayColumns.map((column) => column.headerName) as string[];
        const columnWidths = batchGridDisplayColumns.map((column) => column.width) as number[];
        const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
        cy.viewport(totalWidth + 50, 300);
        cy.mount(<BatchParcelDataGrid rows={mockData} />);

        cy.get(".MuiDataGrid-columnHeaderTitle").each((header, index) => {
            const headerText = header.text().trim();
            expect(headerText).to.equal(headerNames[index]);
        });
    });
});
