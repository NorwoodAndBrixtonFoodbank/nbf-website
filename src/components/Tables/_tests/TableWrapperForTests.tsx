import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    fullNameTextFilterTest,
    MockTableProps,
    TestData,
    typeButtonFilterTest,
} from "./TestingDataAndFuntions";
import {
    CheckboxConfig,
    ClientPaginatedTable,
    DefaultSortConfig,
    EditableConfig,
    FilterConfig,
    OnRowClickFunction,
    PaginationConfig,
    SortConfig,
    SortOptions,
    SortState,
} from "../Table";
import { ClientSideSortMethod } from "../sortMethods";
import { SortOrder } from "react-data-table-component";
import { ClientSideFilter } from "../Filters";


export const TableWrapperForTest: React.FC<MockTableProps<TestData>> = ({
    mockData,
    mockHeaders,
    testableContent: {
        isCheckboxIncluded = false,
        filters = undefined,
        isPaginationIncluded = false,
        sortingFlags = { isSortingOptionsIncluded: false, isDefaultSortIncluded: false },
        editableFlags = { isEditIncluded: false, isDeleteIncluded: false, isSwapIncluded: false },
        isHeaderTogglesIncluded = false,
        isColumnDisplayFunctionsIncluded = false,
        isRowClickIncluded = false,
    },
}) => {
    //to show text on page when action occurs
    const [shownText, setShownText] = useState<string>("");

    const [testDataPortion, setTestDataPortion] = useState<TestData[]>(mockData);

    //Checkbox setup
    const [checkedRowIds, setCheckedRowIds] = useState<string[]>([]);
    const [isAllCheckBoxSelected, setAllCheckBoxSelected] = useState(false);

    useEffect(() => {
        const allChecked = checkedRowIds.length === testDataPortion.length;
        if (allChecked !== isAllCheckBoxSelected) {
            setAllCheckBoxSelected(allChecked);
        }
    }, [testDataPortion.length, checkedRowIds, isAllCheckBoxSelected]);

    const checkboxConfig: CheckboxConfig<TestData> = isCheckboxIncluded
        ? {
              displayed: true,
              selectedRowIds: checkedRowIds,
              isAllCheckboxChecked: isAllCheckBoxSelected,
              onCheckboxClicked: (data: TestData) => {
                  setCheckedRowIds((checkedIds) => {
                      if (checkedIds.includes(data.id)) {
                          return checkedIds.filter((checkedId) => checkedId !== data.id);
                      }
                      return checkedIds.concat([data.id]);
                  });
              },
              onAllCheckboxClicked: () => {
                  if (isAllCheckBoxSelected === true) {
                      setCheckedRowIds([]);
                      setAllCheckBoxSelected(false);
                  } else {
                      setCheckedRowIds(mockData.map((row) => row.id));
                      setAllCheckBoxSelected(true);
                  }
              },
              isRowChecked: (row: TestData) => checkedRowIds.includes(row.id),
          }
        : { displayed: false };

    //Filters setup
    const [primaryFilters, setPrimaryFilters] = useState<ClientSideFilter<TestData, string>[]>(
        filters ? filters.primaryFilters : []
    );
    const [additionalFilters, setAdditionalFilters] = useState<
        ClientSideFilter<TestData, string>[]
    >(filters ? filters.additionalFilters : []);

    const filterConfig: FilterConfig<ClientSideFilter<TestData, string>> =
        filters
            ? {
                  primaryFiltersShown: true,
                  primaryFilters,
                  setPrimaryFilters,
                  additionalFiltersShown: true,
                  additionalFilters,
                  setAdditionalFilters,
              }
            : { primaryFiltersShown: false, additionalFiltersShown: false };

    //Pagination setup
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const startPoint = (currentPage - 1) * perPage;
    const endPoint = currentPage * perPage - 1;

    const paginationConfig: PaginationConfig = isPaginationIncluded
        ? {
              enablePagination: true,
              filteredCount: mockData.length,
              onPageChange: setCurrentPage,
              onPerPageChange: setPerPage,
          }
        : { enablePagination: false };

        useEffect(() => {
            const primaryFilteredData = mockData.filter((row) => {
                return primaryFilters.every((filter) => {
                    return filter.method(row, filter.state, filter.key);
                });
            })
            const secondaryFilteredData = primaryFilteredData.filter((row) => {
                return additionalFilters.every((filter) => {
                    return filter.method(row, filter.state, filter.key);
                });
            });
            setTestDataPortion(
                secondaryFilteredData.slice(startPoint, endPoint + 1)
            );
        }, [primaryFilters, additionalFilters, startPoint, endPoint, mockData]);

    //Sorting setup
    const [sortState, setSortState] = useState<SortState<TestData, ClientSideSortMethod>>({
        sortEnabled: false,
    });

    const sortableColumns: SortOptions<TestData, ClientSideSortMethod>[] = [];
    for (const key of mockHeaders
        .map(([key, _]) => {
            return key;
        })
        .filter((key, index) => key !== "id" && index % 2 == 0)) {
        sortableColumns.push({
            key: key,
            sortMethod: (sortDirection: SortOrder) => {
                const ascendingData = [...testDataPortion].sort((rowA, rowB) =>
                    rowA.full_name > rowB.full_name ? 1 : rowB.full_name > rowA.full_name ? -1 : 0
                );
                if (sortDirection === "asc") {
                    setTestDataPortion(ascendingData);
                } else {
                    setTestDataPortion([...ascendingData].reverse());
                }
            },
        });
    }

    const sortConfig: SortConfig<TestData, ClientSideSortMethod> =
        sortingFlags.isSortingOptionsIncluded
            ? {
                  sortPossible: true,
                  sortableColumns: sortableColumns,
                  setSortState: setSortState,
              }
            : { sortPossible: false };

    const defaultSortConfig: DefaultSortConfig | undefined = sortingFlags.isDefaultSortIncluded
        ? {
              defaultColumnHeaderKey: mockHeaders[0][0],
              defaultSortDirection: "asc" as SortOrder,
          }
        : undefined;

    useEffect(() => {
        if (sortState.sortEnabled && sortState.column.sortMethod) {
            sortState.column.sortMethod(sortState.sortDirection);
        }
    }, [sortState, testDataPortion]);

    //Editable setup
    const editableConfig: EditableConfig<TestData> = {
        editable:
            editableFlags.isEditIncluded ||
            editableFlags.isDeleteIncluded ||
            editableFlags.isSwapIncluded,
        setDataPortion: setTestDataPortion,
        onEdit: editableFlags.isEditIncluded
            ? (row_num) => {
                  setShownText("Edit clicked: " + row_num);
              }
            : undefined,
        onDelete: editableFlags.isDeleteIncluded
            ? (row_num) => {
                  setShownText("Delete clicked: " + row_num);
              }
            : undefined,
        onSwapRows: editableFlags.isSwapIncluded
            ? async (row1, row2) => {
                  async () => {
                      setShownText("Swapped rows: " + row1 + " and " + row2);
                  };
              }
            : undefined,
        isDeletable: editableFlags.isDeleteIncluded ? (row) => row.id != "0" : undefined,
    };

    //Header toggles setup
    const defaultShownHeaders: (keyof TestData)[] | undefined = isHeaderTogglesIncluded
        ? mockHeaders
              .map(([key, _]) => {
                  return key;
              })
              .slice(0, mockHeaders.length - 1)
        : undefined;
    const toggleableHeaders: (keyof TestData)[] | undefined = isHeaderTogglesIncluded
        ? mockHeaders
              .map(([key, _]) => {
                  return key;
              })
              .slice(1, mockHeaders.length)
        : undefined;

    //Create onRowClick function
    const onRowClick: OnRowClickFunction<TestData> | undefined = isRowClickIncluded
        ? (row) => {
              setShownText("row clicked " + row.data[mockHeaders[0][0]]);
          }
        : undefined;

    //Render table with mock content
    return (
        <>
            <ClientPaginatedTable
                dataPortion={testDataPortion}
                headerKeysAndLabels={mockHeaders}
                checkboxConfig={checkboxConfig}
                filterConfig={filterConfig}
                paginationConfig={paginationConfig}
                sortConfig={sortConfig}
                defaultSortConfig={defaultSortConfig}
                editableConfig={editableConfig}
                defaultShownHeaders={defaultShownHeaders}
                toggleableHeaders={toggleableHeaders}
                onRowClick={onRowClick}
            />
            <p>{shownText}</p>
        </>
    );
};
