import React, { useEffect, useState } from "react";
import Table, {
    CheckboxConfig,
    FilterConfig,
    PaginationConfig,
    SortConfig,
    SortOptions,
} from "@/components/Tables/Table";
import StyleManager from "@/app/themes";
import { Filter } from "./Filters";

interface TestData {
    full_name: string;
    phone_number: string;
    id: string;
}

const data: TestData[] = [
    {
        full_name: "Tom",
        phone_number: "123456",
        id: "0",
    },
    {
        full_name: "Sam",
        phone_number: "999",
        id: "1",
    },
    {
        full_name: "Harper Garrett",
        phone_number: "2171786554",
        id: "2",
    },
    {
        full_name: "Adrian Key",
        phone_number: "3650099130",
        id: "3",
    },
    {
        full_name: "Harrell Wallace",
        phone_number: "4650047935",
        id: "4",
    },
    {
        full_name: "Oneill Curtis",
        phone_number: "7058491995",
        id: "5",
    },
    {
        full_name: "Herring Rutledge",
        phone_number: "1440882899",
        id: "6",
    },
    {
        full_name: "Eloise Rowland",
        phone_number: "2580325390",
        id: "7",
    },
    {
        full_name: "Cathryn Burks",
        phone_number: "7136166489",
        id: "8",
    },
    {
        full_name: "Paopao",
        phone_number: "7136166469",
        id: "9",
    },
    {
        full_name: "Forbes Doyle",
        phone_number: "1377097191",
        id: "10",
    },
    {
        full_name: "Agnes Rosales",
        phone_number: "3334796379",
        id: "11",
    },
    {
        full_name: "Jan Orr",
        phone_number: "1526538148",
        id: "12",
    },
    {
        full_name: "Colleen Lowery",
        phone_number: "3980156139",
        id: "13",
    },
    {
        full_name: "Chloe",
        phone_number: "4567894522",
        id: "14",
    },
];

const smallerData = data.slice(0, 3);

const headers = [
    ["full_name", "Name"],
    ["phone_number", "Phone Number"],
] as const;

interface TestTableProps {
    displayCheckboxes?: boolean;
    toggleableHeaders?: (keyof TestData)[];
    pagination?: boolean;
    primaryFilters?: Filter<TestData, any>[];
    setPrimaryFilters?: (primaryFilters: Filter<TestData, any>[]) => void;
    sortable?: SortOptions<TestData, any>[];
    tableData?: TestData[];
}

const Component: React.FC<TestTableProps> = ({
    displayCheckboxes = true,
    toggleableHeaders,
    pagination = false,
    primaryFilters = [],
    setPrimaryFilters = () => {},
    sortable = [],
    tableData = data,
}) => {
    const [testDataPortion, setTestDataPortion] = useState<TestData[]>(tableData);

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const startPoint = (currentPage - 1) * perPage;
    const endPoint = currentPage * perPage - 1;

    useEffect(() => {
        setTestDataPortion(tableData.slice(startPoint, endPoint));
    }, [startPoint, endPoint, tableData]);

    const [checkedRowIds, setCheckedRowIds] = useState<string[]>([]);
    const [isAllCheckBoxSelected, setAllCheckBoxSelected] = useState(false);

    useEffect(() => {
        setCheckedRowIds([]);
    }, [primaryFilters]);

    const selectOrDeselectRow = (data: TestData): void => {
        setCheckedRowIds((checkedIds) => {
            if (checkedIds.includes(data.id)) {
                return checkedIds.filter((dummyId) => dummyId !== data.id);
            }
            return checkedIds.concat([data.id]);
        });
    };

    const toggleAllCheckBox = async (): Promise<void> => {
        if (isAllCheckBoxSelected) {
            setCheckedRowIds([]);
            setAllCheckBoxSelected(false);
        } else {
            setCheckedRowIds(tableData.map((row) => row.id));
            setAllCheckBoxSelected(true);
        }
    };

    useEffect(() => {
        const allChecked = checkedRowIds.length === tableData.length;
        if (allChecked !== isAllCheckBoxSelected) {
            setAllCheckBoxSelected(allChecked);
        }
    }, [tableData.length, checkedRowIds, isAllCheckBoxSelected]);

    const trueCheckboxConfig: CheckboxConfig<TestData> = {
        displayed: true,
        selectedRowIds: checkedRowIds,
        isAllCheckboxChecked: isAllCheckBoxSelected,
        onCheckboxClicked: (data: TestData) => selectOrDeselectRow(data),
        onAllCheckboxClicked: () => toggleAllCheckBox(),
        isRowChecked: (row: TestData) => checkedRowIds.includes(row.id),
    };

    const falseCheckboxConfig: CheckboxConfig<TestData> = {
        displayed: false,
    };

    const truePaginationConfig: PaginationConfig = {
        pagination: true,
        totalRows: tableData.length,
        onPageChange: setCurrentPage,
        onPerPageChange: setPerPage,
    };

    const falsePaginationConfig: PaginationConfig = {
        pagination: false,
    };

    const trueFilterConfig: FilterConfig<TestData> = {
        primaryFiltersShown: true,
        primaryFilters: primaryFilters,
        setPrimaryFilters: setPrimaryFilters,
        additionalFiltersShown: false,
    };

    const falseFilterConfig: FilterConfig<TestData> = {
        primaryFiltersShown: false,
        additionalFiltersShown: false,
    };

    const trueSortConfig: SortConfig<TestData> = {
        sortShown: true,
        sortableColumns: sortable,
        setSortState: () => {}, //to do: get sort and filters working for table test
    };

    const falseSortConfig: SortConfig<TestData> = {
        sortShown: false,
    };

    return (
        <StyleManager>
            <Table
                dataPortion={testDataPortion}
                headerKeysAndLabels={headers}
                toggleableHeaders={toggleableHeaders}
                paginationConfig={pagination ? truePaginationConfig : falsePaginationConfig}
                checkboxConfig={displayCheckboxes ? trueCheckboxConfig : falseCheckboxConfig}
                filterConfig={primaryFilters ? trueFilterConfig : falseFilterConfig}
                editableConfig={{ editable: false }}
                sortConfig={sortable ? trueSortConfig : falseSortConfig}
            />
        </StyleManager>
    );
};

describe("<Table />", () => {
    it("renders", () => {
        cy.mount(<Component tableData={data} />);
    });

    it("can display data", () => {
        cy.mount(<Component />);
        cy.contains("Tom");
        cy.contains("Sam");
        cy.contains("123456");
        cy.contains("999");
    });

    // it("filter is correct", () => {
    //     cy.mount(<Component filters={["full_name"]} />);
    //     cy.get("input[type='text']").first().type("Tom");
    //     cy.contains("Tom");
    //     cy.should("not.have.value", "Sam");
    // });

    // it("sorting is correct", () => {
    //     cy.mount(<Component filters={[]} sortable={["full_name"]} />);
    //     cy.get("div").contains("Name").parent().click();
    //     cy.get("div[data-column-id='2'][role='cell']").as("table");
    //     cy.get("@table").eq(0).contains("Adrian Key");
    //     cy.get("@table").eq(1).contains("Agnes Rosales");
    //     cy.get("div").contains("Name").parent().click();
    //     cy.get("@table").eq(0).contains("Tom");
    //     cy.get("@table").eq(1).contains("Sam");
    // });

    // it("clear button is working", () => {
    //     cy.mount(<Component filters={["full_name"]} />);
    //     cy.get("input[type='text']").type("Tom");
    //     cy.get("button").contains("Clear").click();
    //     cy.contains("Sam");
    //     cy.get("input[type='text']").should("have.value", "");
    // });

    it("pagination page change is working", () => {
        cy.mount(<Component pagination />);
        cy.get("div[data-column-id='2'][role='cell']").as("table");
        cy.get("@table").eq(0).contains("Tom");
        cy.get("button[id='pagination-next-page']").click();
        cy.get("@table").eq(0).contains("Forbes Doyle");
    });

    it("pagination number of items is working", () => {
        cy.mount(<Component pagination />);
        cy.get("select[aria-label='Rows per page:']").select("15");
        cy.get("div[data-column-id='2'][role='cell']").as("table");
        cy.get("@table").eq(14).contains("Chloe");
        cy.get("@table").eq(15).should("not.exist");
    });

    it("checkbox select toggles", () => {
        cy.mount(<Component />);
        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[aria-label='Select row 0']").should("be.checked");
        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
    });

    it("checkbox toggles only the selected one", () => {
        cy.mount(<Component />);
        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
        cy.get("input[aria-label='Select row 2']").click();
        cy.get("input[aria-label='Select row 0']").click();

        cy.get("input[aria-label='Select row 0']").should("be.checked");
        cy.get("input[aria-label='Select row 1']").should("not.be.checked");
        cy.get("input[aria-label='Select row 2']").should("be.checked");

        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
        cy.get("input[aria-label='Select row 1']").should("not.be.checked");
        cy.get("input[aria-label='Select row 2']").should("be.checked");
    });

    // it("filtering does not affect checkbox", () => {
    //     cy.mount(<Component filters={["full_name"]} />);
    //     cy.get("input[aria-label='Select row 0']").should("not.be.checked");
    //     cy.get("input[aria-label='Select row 0']").click();
    //     cy.get("input[type='text']").type("Sam");
    //     cy.get("input[type='text']").clear();
    //     cy.get("input[aria-label='Select row 0']").should("be.checked");
    // });

    it("changing page does not affect checkbox", () => {
        cy.mount(<Component pagination />);
        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
        cy.get("input[aria-label='Select row 0']").click();
        cy.get("button[id='pagination-next-page']").click();
        cy.get("button[id='pagination-previous-page']").click();
        cy.get("input[aria-label='Select row 0']").should("be.checked");
    });

    it("pagination limit does not affect checkbox", () => {
        cy.mount(<Component pagination />);
        cy.get("select[aria-label='Rows per page:']").select("15");
        cy.get("input[aria-label='Select row 14']").should("not.be.checked");

        cy.get("input[aria-label='Select row 14']").click();
        cy.get("input[aria-label='Select row 14']").should("be.checked");

        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[aria-label='Select row 0']").should("be.checked");

        cy.get("select[aria-label='Rows per page:']").select("10");
        cy.get("input[aria-label='Select row 0']").should("be.checked");
        cy.get("select[aria-label='Rows per page:']").select("15");

        cy.get("input[aria-label='Select row 0']").should("be.checked");
        cy.get("input[aria-label='Select row 14']").should("be.checked");
    });

    // it("sorting does not affect checkbox", () => {
    //     cy.mount(<Component sortable={["full_name"]} />);

    //     cy.get("input[aria-label='Select row 0']").click();
    //     cy.get("input[aria-label='Select row 0']").should("be.checked");

    //     cy.get("input[aria-label='Select row 2']").click();
    //     cy.get("input[aria-label='Select row 2']").should("be.checked");

    //     cy.get("div").contains("Name").parent().click();
    //     cy.get("input[aria-label='Select row 2']").should("be.checked");
    //     cy.get("div").contains("Name").parent().click();

    //     cy.get("input[aria-label='Select row 0']").should("be.checked");
    //     cy.get("input[aria-label='Select row 2']").should("be.checked");
    // });

    it("checkall box toggles all data", () => {
        cy.mount(<Component tableData={smallerData} />);
        cy.get("input[aria-label='Select all rows']").click();
        cy.get("input[aria-label='Select row 0']").should("be.checked");
        cy.get("input[aria-label='Select row 1']").should("be.checked");
        cy.get("input[aria-label='Select row 2']").should("be.checked");
    });

    it("uncheck one row unticks the checkall box", () => {
        cy.mount(<Component tableData={smallerData} />);
        cy.get("input[aria-label='Select all rows']").click();
        cy.get("input[aria-label='Select row 0']").click();

        cy.get("input[aria-label='Select row 0']").should("not.be.checked");
        cy.get("input[aria-label='Select row 1']").should("be.checked");
        cy.get("input[aria-label='Select row 2']").should("be.checked");
        cy.get("input[aria-label='Select all rows']").should("not.be.checked");
    });

    it("check all rows ticks the checkall box", () => {
        cy.mount(<Component tableData={smallerData} />);
        cy.get("input[aria-label='Select row 0']").click();
        cy.get("input[aria-label='Select row 1']").click();
        cy.get("input[aria-label='Select row 2']").click();

        cy.get("input[aria-label='Select all rows']").should("be.checked");
    });

    it("checkbox disabling works", () => {
        cy.mount(<Component tableData={smallerData} displayCheckboxes={false} />);
        cy.get("input[aria-label='Select row 0']").should("not.exist");
        cy.get("input[aria-label='Select row 5']").should("not.exist");
        cy.get("input[aria-label='Select row 10']").should("not.exist");
    });
});
