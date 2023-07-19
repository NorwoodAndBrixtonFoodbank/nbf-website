"use client";

import Table from "@/components/Tables/Table";
import React from "react";
import { styled } from "styled-components";

export type ListRow = { [headerKey: string]: string | null };

const TableDiv = styled.div`
    margin: 20px;
    padding: 20px;
    background-color: ${(props) => props.theme.surfaceBackgroundColor};
    border: solid 1px ${(props) => props.theme.surfaceForegroundColor};
    border-radius: 1rem;
`;

const StyledTable = styled(Table)`
    width: 100%;
    background-color: transparent;
`;

const StyledAddButton = styled.button`
    margin: 10px 5px 5px 0;
    height: 2rem;
    width: 5rem;
`;

type Props = {
    data: ListRow[] | null;
};

const ListsDataView: React.FC<Props> = ({ data: rawData }) => {
    if (rawData === null) {
        throw new Error("No data found");
    }

    const dataAndTooltips = rawData?.map((row) => {
    const dataAndTooltips = rawData?.map((row) => {
        const data: ListRow = {
            item_name: row.item_name,
        };
        const tooltips: ListRow = {};
        for (let index = 1; index <= 10; index++) {
            const header = `${index}_quantity`;
            data[header] = row[header];
            tooltips[header] = row[`${index}_notes`];
        }
        return {
            data,
            tooltips,
        };
    });

    const headers: [string, string][] = [
        ["item_name", "Description"],
        ["1_quantity", "Single"],
        ["2_quantity", "Family of 2"],
        ["3_quantity", "Family of 3"],
        ["4_quantity", "Family of 4"],
        ["5_quantity", "Family of 5"],
        ["6_quantity", "Family of 6"],
        ["7_quantity", "Family of 7"],
        ["8_quantity", "Family of 8"],
        ["9_quantity", "Family of 9"],
        ["10_quantity", "Family of 10+"],
    ];

    // extract header keys
    const toggleableHeaders = headers.map(([key]) => key);
    // removing description header from Toggleable Headers using shift
    toggleableHeaders.shift();

    return (
        <>
            <TableDiv>
                <StyledTable
                    checkboxes={false}
                    headers={headers}
                    toggleableHeaders={toggleableHeaders}
                    defaultShownHeaders={["item_name", ...toggleableHeaders]}
                    data={dataAndTooltips}
                    reorderable
                    filters={["item_name"]}
                    pagination={false}
                />
                <StyledAddButton>+ Add</StyledAddButton>
            </TableDiv>
        </>
    );
};

export default ListsDataView;
