import React from "react";
import "@testing-library/jest-dom/jest-globals";
import { render, cleanup, screen, fireEvent, within, getByLabelText } from "@testing-library/react";
import { ClientPaginatedTable } from "@/components/Tables/Table";
import StyleManager from "@/app/themes";
import {
    fakeData,
    fakeSmallerData,
    fakeMidData,
    fakeDataHeaders,
    TestData,
    fullNameTextFilterTest,
    typeButtonFilterTest,
} from "./TestingDataAndFuntions";
import { expect, it } from "@jest/globals";
import { TableWrapperForTest } from "./TableWrapperForTests";
import userEvent from "@testing-library/user-event";
import { ex } from "@fullcalendar/core/internal-common";

describe("Table without features", () => {
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

    it("should render the table without checkboxes", () => {
        for (let index = 0; index < fakeMidData.length; index++) {
            const checkbox = screen.queryByLabelText(`Select row ${index}`);
            expect(checkbox).toBeNull();
        }
    });

    it("should render the table without filters", () => {
        expect(screen.queryByLabelText("Name")).toBeNull();
        expect(screen.queryByText("Hotel")).toBeNull();
        expect(screen.queryByText("Regular")).toBeNull();
        expect(screen.queryByText("More")).toBeNull();
        expect(screen.queryByText("Clear")).toBeNull();
    });
});

describe("Table with checkboxes", () => {
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

    it("should allow checkboxes to be toggled on and off and have no impact on other checkboxes", () => {
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

    it("should have checkall box triggered when all rows checkboxes are checked", () => {
        for (let index = 0; index < fakeMidData.length; index++) {
            fireEvent.click(
                within(screen.getByLabelText(`Select row ${index}`)).getByRole("checkbox")
            );
        }
        expect(
            within(screen.getByLabelText("Select all rows")).getByRole("checkbox")
        ).toBeChecked();
    });

    it("should have checkall box unchecked when one row is unchecked", () => {
        const selectAllCheckbox = within(screen.getByLabelText("Select all rows")).getByRole(
            "checkbox"
        );
        fireEvent.click(selectAllCheckbox);
        expect(selectAllCheckbox).toBeChecked();
        const row1Checkbox = within(screen.getByLabelText("Select row 0")).getByRole("checkbox");
        expect(row1Checkbox).toBeChecked();
        fireEvent.click(row1Checkbox);
        expect(row1Checkbox).not.toBeChecked();
        expect(selectAllCheckbox).not.toBeChecked();
    });
});

describe("Table with primary filters", () => {
    beforeEach(() => {
        render(
            <StyleManager>
                <TableWrapperForTest
                mockData={fakeMidData}
                mockHeaders={fakeDataHeaders}
                testableContent={{ filters: { primaryFilters: [fullNameTextFilterTest, typeButtonFilterTest], additionalFilters: [] }}}
            />
            </StyleManager>
        );
    });

    afterEach(cleanup);

    it("should render the table with name input box", () => {
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    it("should have text filter correctly select table rows by first names that match input", async () => {
        const user = userEvent.setup();
        const nameInput = screen.getByLabelText("Name");
        expect(screen.queryByText("Harper")).toBeInTheDocument();
        await user.type(nameInput, "Tom");
        expect(screen.getByText("Tom")).toBeInTheDocument();
        expect(screen.queryByText("Harper")).toBeNull();
    });

    it("should render table with default filters", () => {
        fakeMidData.forEach((data) => {
            data.type === "regular" ? expect(screen.getByText(data.full_name)).toBeInTheDocument() : expect(screen.queryByText(data.full_name)).toBeNull();
        });
    });

    it("should have button filter correctly select table rows by type", () => {
        fireEvent.click(screen.getByText("Hotel"));
        console.log(screen.getByText("Hotel"))
        fakeMidData.forEach((data) => {
            data.type === "regular" ? expect(screen.queryByText(data.full_name)).toBeNull() : expect(screen.getByText(data.full_name)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Regular"));
        fakeMidData.forEach((data) => {
            data.type === "regular" ? expect(screen.getByText(data.full_name)).toBeInTheDocument() : expect(screen.queryByText(data.full_name)).toBeNull();
        });
    });

    it("should have clear button remove all filters except those that specify to persist", () => {
        const nameInput = screen.getByLabelText("Name");
        const clearButton = screen.getByText("Clear");
        const hotelButton = screen.getByText("Hotel");
        fireEvent.click(hotelButton);
        fireEvent.change(nameInput, { target: { value: "Sam" } });
        fakeMidData.forEach((data) => {
            data.full_name === "Sam" ? expect(screen.getByText(data.full_name)).toBeInTheDocument() : expect(screen.queryByText(data.full_name)).toBeNull();
        });
        fireEvent.click(clearButton);
        fakeMidData.forEach((data) => {
            data.type === "regular" ? expect(screen.queryByText(data.full_name)).toBeNull() : expect(screen.getByText(data.full_name)).toBeInTheDocument();
        });
    });
    
})

describe("Table with primary and secondary filters", () => {
    beforeEach(() => {
        render(
            <StyleManager>
                <TableWrapperForTest
                    mockData={fakeMidData}
                    mockHeaders={fakeDataHeaders}
                    testableContent={{filters: { primaryFilters: [fullNameTextFilterTest], additionalFilters: [typeButtonFilterTest]}}}
                />
            </StyleManager>
        );
    });

    afterEach(cleanup);

    it("should render the table with more filters button", () => {
        expect(screen.getByText("More")).toBeInTheDocument();
    })

    it("should have more filters button toggle additional filters on and off", () => {
        const moreButton = screen.getByText("More");
        expect(screen.queryByText("Regular")).toBeNull();
        fireEvent.click(moreButton);
        expect(screen.getByText("Regular")).toBeInTheDocument();
        expect(screen.getByText("Less")).toBeInTheDocument();
        fireEvent.click(moreButton);
        expect(screen.queryByText("Regular")).toBeNull();
    })
})

describe("Table with primary filters and checkboxes", () => {
    beforeEach(() => {
        render(
            <StyleManager>
                <TableWrapperForTest
                    mockData={fakeMidData}
                    mockHeaders={fakeDataHeaders}
                    testableContent={{ isCheckboxIncluded: true, filters: { primaryFilters: [fullNameTextFilterTest], additionalFilters: [] } }}
                />
            </StyleManager>
        );
    });

    afterEach(cleanup);

    it("should have checkboxes unaffected by filtering", () => {
        for (let index = 0; index < fakeMidData.length; index++) {
            expect(
                within(screen.getByLabelText(`Select row ${index}`)).getByRole("checkbox")
            ).not.toBeChecked();
        }
        const checkbox = within(screen.getByLabelText(`Select row 0`)).getByRole(
            "checkbox"
        );
        fireEvent.click(checkbox);
        expect(
            within(screen.getByLabelText(`Select row 0`)).getByRole("checkbox")
        ).toBeChecked();
        const nameInput = screen.getByLabelText("Name");
        fireEvent.change(nameInput, { target: { value: "Sam" } });
        const clearButton = screen.getByText("Clear");
        fireEvent.click(clearButton);
        expect(
            within(screen.getByLabelText(`Select row 0`)).getByRole("checkbox")
        ).toBeChecked();
        for (let index = 1; index < fakeMidData.length; index++) {
            expect(
                within(screen.getByLabelText(`Select row ${index}`)).getByRole("checkbox")
            ).not.toBeChecked();
        }
    })
});