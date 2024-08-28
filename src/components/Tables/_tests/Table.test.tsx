import React from "react";
import "@testing-library/jest-dom/jest-globals";
import { render, cleanup, screen, fireEvent, within } from "@testing-library/react";
import { ClientPaginatedTable } from "@/components/Tables/Table";
import StyleManager from "@/app/themes";
import {
    fakeData,
    fakeSmallerData,
    fakeMidData,
    fakeDataHeaders,
    TestData,
} from "./TestingDataAndFuntions";
import { expect, it } from "@jest/globals";
import { TableWrapperForTest } from "./TableWrapperForTests";

describe("Table display", () => {
    beforeEach(() => {
        render(
            <StyleManager>
                <ClientPaginatedTable<TestData, string>
                    dataPortion={fakeData}
                    headerKeysAndLabels={fakeDataHeaders}
                    checkboxConfig={{ displayed: false }}
                    paginationConfig={{ enablePagination: false }}
                    sortConfig={{ sortPossible: false }}
                    filterConfig={{ primaryFiltersShown: false, additionalFiltersShown: false }}
                    editableConfig={{ editable: false }}
                />
            </StyleManager>
        );
    });

    afterEach(cleanup);

    it("should render the table with the correct headers and data", () => {
        fakeDataHeaders.forEach((header) => {
            expect(screen.getByText(header[1])).toBeInTheDocument();
        });
        fakeData.forEach((data) => {
            expect(screen.getByText(data.full_name)).toBeInTheDocument();
        });
    });
});

describe("Table checkboxes", () => {
    beforeEach(() => {
        render(
            <StyleManager>
                <TableWrapperForTest
                    mockData={fakeMidData}
                    mockHeaders={fakeDataHeaders}
                    testableContent={{ isCheckboxIncluded: true }}
                />
            </StyleManager>
        );
    });

    afterEach(cleanup);

    it("should render the table with checkboxes", () => {
        expect(screen.getByLabelText("Select row 0")).toBeInTheDocument();
    });

    it("should render the table with a checkbox for each row", () => {
        for (let index = 0; index < fakeMidData.length; index++) {
            expect(screen.getByLabelText(`Select row ${index}`)).toBeInTheDocument();
        }
    });

    it("should allow checkboxes to be clicked and have no impact on other checkboxes", () => {
        fakeMidData.forEach((_, index) => {
            const checkbox = within(screen.getByLabelText(`Select row ${index}`)).getByRole(
                "checkbox"
            );
            fireEvent.click(checkbox);
            expect(checkbox).toBeChecked();
            if (index > 0) {
                expect(
                    within(screen.getByLabelText(`Select row ${index - 1}`)).getByRole("checkbox")
                ).not.toBeChecked();
            }
            fireEvent.click(checkbox);
            expect(checkbox).not.toBeChecked();
        });
    });

    it("should have checkall box that toggles every checkbox", () => {
        const selectAllCheckbox = within(screen.getByLabelText("Select all rows")).getByRole(
            "checkbox"
        );
        fireEvent.click(selectAllCheckbox);
        for (let index = 0; index < fakeMidData.length; index++) {
            expect(
                within(screen.getByLabelText(`Select row ${index}`)).getByRole("checkbox")
            ).toBeChecked();
        }
        fireEvent.click(selectAllCheckbox);
        fakeMidData.forEach((_, index) => {
            expect(
                within(screen.getByLabelText(`Select row ${index}`)).getByRole("checkbox")
            ).not.toBeChecked();
        });
    });

    it("checkall box triggered when all rows checkboxes are checked", () => {
        for (let index = 0; index < fakeMidData.length; index++) {
            fireEvent.click(
                within(screen.getByLabelText(`Select row ${index}`)).getByRole("checkbox")
            );
        }
        expect(
            within(screen.getByLabelText("Select all rows")).getByRole("checkbox")
        ).toBeChecked();
    });
});
