"use client";

import React, { useState } from "react";
import { TablePagination } from "@mui/material";
import { ClientsTableRow, getClientsTableData } from "@/app/clients/getClientsTableData";
// import { useSearchParams } from 'next/navigation';

interface CustomPaginationBarProps {
    dataState: ClientsTableRow[];
    setDataState: React.Dispatch<React.SetStateAction<ClientsTableRow[]>>;
    total: number;
}

const CustomPaginationBar: React.FC<CustomPaginationBarProps> = ({
    dataState,
    setDataState,
    total,
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [allData, setAllData] = useState(dataState);
    // const searchParams = useSearchParams()
    // const search = searchParams.get('search')

    const handleChangePage = async (_event: unknown, newPage: number) => {
        if (allData.length === total || allData.length >= 10 * newPage + 10) {
            // Get the data from allData
            setDataState(allData.slice(10 * newPage, 10 * newPage + 10));
        } else {
            const data = await getClientsTableData(10 * newPage, 10 * newPage + 9);
            setAllData(allData.concat(data));
            setDataState(data);
        }
        setPage(newPage); // New page is an int starting from 0
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);

        // Database request happens here: need to make sure to fetch only new data to not request same data unecessary
    };

    // const totalRows = 100; // Need to change this to a database count request with all the filters etc.
    
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
