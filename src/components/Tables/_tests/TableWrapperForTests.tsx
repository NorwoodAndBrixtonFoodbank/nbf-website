import React, { useEffect, useState } from "react";
import { MockTableProps, TestData } from "./TestingDataAndFuntions";
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
        sortingFlags = {
            isSortingOptionsIncluded: false,
            isDefaultSortIncluded: false,
            sortMethod: undefined,
        },
        isRowEditableIncluded = false,
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

    const filterConfig: FilterConfig<ClientSideFilter<TestData, string>> = filters
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
    const [perPage, setPerPage] = useState(7);
    const [currentPage, setCurrentPage] = useState(1);
    const startPoint = (currentPage - 1) * perPage;
    const endPoint = currentPage * perPage - 1;

    const paginationConfig: PaginationConfig = isPaginationIncluded
        ? {
              enablePagination: true,
              filteredCount: mockData.length,
              onPageChange: setCurrentPage,
              onPerPageChange: setPerPage,
              rowsPerPageOptions: [5, 7, 10],
          }
        : { enablePagination: false };

    useEffect(() => {
        const primaryFilteredData = mockData.filter((row) => {
            return primaryFilters.every((filter) => {
                return filter.method(row, filter.state, filter.key);
            });
        });
        const secondaryFilteredData = primaryFilteredData.filter((row) => {
            return additionalFilters.every((filter) => {
                return filter.method(row, filter.state, filter.key);
            });
        });
        setTestDataPortion(secondaryFilteredData.slice(startPoint, endPoint + 1));
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
            sortMethod: sortingFlags.sortMethod ? sortingFlags.sortMethod : () => undefined,
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
    const editableConfig: EditableConfig<TestData> = isRowEditableIncluded
        ? {
              editable: true,
              setDataPortion: setTestDataPortion,
              onEdit: (row_num) => {
                  setShownText("Edit clicked: " + row_num);
              },
              onDelete: (row_num) => {
                  setShownText("Delete clicked: " + row_num);
              },
              onSwapRows: async () => undefined,
              isDeletable: (row) => row.id != "0",
          }
        : { editable: false };

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

    //Create column display functions
    const columnDisplayFunction = isColumnDisplayFunctionsIncluded
        ? {
              full_name: (fullName: TestData["full_name"]) => fullName.toUpperCase(),
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
                columnDisplayFunctions={columnDisplayFunction}
            />
            <p>{shownText}</p>
        </>
    );
};
