"use client";

import React, { useState } from "react";
import { TablePagination } from "@mui/material";
import { ClientsTableRow, getClientsTableData } from "@/app/clients/getClientsTableData";

interface CustomPaginationBarProps {
    dataState: ClientsTableRow[];
    setDataState: React.Dispatch<React.SetStateAction<ClientsTableRow[]>>;
    total: number;
}

const getInitPagesArray = (rowsPerPage: number, total: number): boolean[] => {
    const pagesArray = [true];
    const numberOfPages = Math.ceil(total / rowsPerPage);
    for (let pageIndex = 1; pageIndex < numberOfPages; pageIndex++) {
        pagesArray.push(false);
    }
    return pagesArray;
};

const generatePagesArray = (
    startingTrueCount: number,
    middleFalseCount: number,
    endingTrueCount: number
): boolean[] => {
    // Can probably use this instead of the one above
    const result = [];

    result.push(...Array(startingTrueCount).fill(true));
    result.push(...Array(middleFalseCount).fill(false));
    result.push(...Array(endingTrueCount).fill(true));

    return result;
};

const reformatAllData = async (
    // Assume on sorting and filtering, we go to first page
    rowsPerPage: number,
    newRowsPerPage: number,
    allData: ClientsTableRow[],
    pagesLoaded: boolean[],
    total: number
) => {
    let startingDataLength = 0;
    for (let isPageLoaded of pagesLoaded) {
        if (!isPageLoaded) {
            break;
        }
        startingDataLength += rowsPerPage;
    }

    let startPaddingEndIndex =
        startingDataLength +
        ((newRowsPerPage - (startingDataLength % newRowsPerPage)) % newRowsPerPage) -
        1;

    const startPaddingData = await getClientsTableData(startingDataLength, startPaddingEndIndex);

    const remainingDataLength = allData.length - startingDataLength;
    const endPaddingStartIndex =
        total -
        remainingDataLength -
        ((newRowsPerPage - (remainingDataLength % newRowsPerPage)) % newRowsPerPage) - 1 ;

    const endPaddingData = await getClientsTableData(
        endPaddingStartIndex,
        total - remainingDataLength - 1
    );

    const newAllData = allData
        .slice(0, startingDataLength)
        .concat(startPaddingData, endPaddingData, allData.slice(startingDataLength));

    const numOfStartPages = Math.ceil(
        (startingDataLength + startPaddingData.length) / newRowsPerPage
    );
    const numOfEndPages = Math.ceil((remainingDataLength + endPaddingData.length) / newRowsPerPage);
    const numOfUnloadedPages = Math.ceil(total / rowsPerPage) - numOfStartPages - numOfEndPages;
    console.log(endPaddingStartIndex);
    console.log(total - remainingDataLength - 1);
    
    console.log(startingDataLength);
    console.log(startPaddingData.length);
    console.log(remainingDataLength);
    console.log(endPaddingData.length);

    console.log(numOfStartPages, numOfUnloadedPages, numOfEndPages);
    const newPagesLoaded = generatePagesArray(numOfStartPages, numOfUnloadedPages, numOfEndPages);

    return { newAllData, newPagesLoaded };
};

const CustomPaginationBar: React.FC<CustomPaginationBarProps> = ({
    dataState,
    setDataState,
    total,
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pagesLoaded, setPagesLoaded] = useState(getInitPagesArray(10, total));
    const [allData, setAllData] = useState(dataState);

    const handleChangePage = async (_event: unknown, newPage: number) => {
        // Change all 10s to rowsPerPage
        if (pagesLoaded[newPage]) {
            setDataState(allData.slice(rowsPerPage * newPage, rowsPerPage * newPage + rowsPerPage));
        } else {
            const data = await getClientsTableData(
                rowsPerPage * newPage,
                rowsPerPage * newPage + rowsPerPage - 1
            );
            pagesLoaded[newPage] = true;
            setPagesLoaded(pagesLoaded);
            setAllData(allData.concat(data));
            setDataState(data);
        }
        setPage(newPage); // New page is an int starting from 0
    };

    const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = +event.target.value;
        const { newAllData, newPagesLoaded } = await reformatAllData(
            rowsPerPage,
            newRowsPerPage,
            allData,
            pagesLoaded,
            total
        );
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        setAllData(newAllData);
        setDataState(newAllData.slice(0, newRowsPerPage));
        setPagesLoaded(newPagesLoaded);
    };

    return (
        // Looks a little weird on mobile (Needs scrolling)
        <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    );
};

export default CustomPaginationBar;
