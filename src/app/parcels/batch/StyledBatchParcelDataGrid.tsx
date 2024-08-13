import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import styled from "styled-components";
import React from "react";

const BatchParcelDataGridStyling = styled(DataGrid)`
    & .MuiDataGrid-cell {
        border: 1px solid;
        border-color: ${(props) => props.theme.main.border};
        & .MuiInputBase-root {
            height: 100%;
        }
    }
    & .MuiDataGrid-columnHeaders {
        border-bottom: 3px solid;
        border-top: 2px solid;
        border-color: ${(props) => props.theme.main.border};
    }
    & .MuiDataGrid-columnHeader {
        border-left: 1px solid;
        border-right: 1px solid;
        border-color: ${(props) => props.theme.main.border};
    }
    & .MuiDataGrid-columnHeaderTitle {
        font-weight: bold;
    }
    & .Mui-error {
        background-color: ${(props) => props.theme.error};
        color: ${(props) => props.theme.text};
    }
    border: 1px solid;
    border-color: ${(props) => props.theme.main.border};
    margin: 1rem;
`;

const StyledBatchParcelDataGrid: React.FC<DataGridProps> = (props) => (
    <BatchParcelDataGridStyling {...props} />
);

export default StyledBatchParcelDataGrid;
