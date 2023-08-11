import React from "react";
import { Paper } from "@mui/material";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
    margin: 1rem;
    padding: 1rem;
    border-radius: 1rem;
    background-color: ${(props) => props.theme.main.background[1]};
`;

interface Props {
    children: React.ReactNode;
}

const TableSurface: React.FC<Props> = ({ children }) => {
    return <StyledPaper elevation={3}>{children}</StyledPaper>;
};

export default TableSurface;
