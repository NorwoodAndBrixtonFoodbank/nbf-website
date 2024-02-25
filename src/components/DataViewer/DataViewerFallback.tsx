"use client";

import React from "react";
import { Skeleton } from "@mui/material";
import styled from "styled-components";
import { DataViewerContainer, DataViewerItem } from "./DataViewer";

const SkeletonKey = styled(Skeleton)`
    flex: 0 0 30%;
    padding: 0.2em 0.5em;
    color: transparent;
`;

const SkeletonValue = styled(Skeleton)`
    padding: 0.2em 0.5em;
`;

const defaultFieldPlaceholders = [
    "field",
    "field",
    "large_field___________",
    "medium_field_____",
    "field",
];

interface Props {
    fieldPlaceholders?: string[];
}

const DataViewerFallback: React.FC<Props> = ({ fieldPlaceholders = defaultFieldPlaceholders }) => {
    return (
        <DataViewerContainer>
            {fieldPlaceholders.map((placeholder, index) => {
                return (
                    <DataViewerItem key={index}>
                        <SkeletonKey variant="text">{placeholder}</SkeletonKey>
                        <SkeletonValue variant="text" width={200} />
                    </DataViewerItem>
                );
            })}
        </DataViewerContainer>
    );
};

export default DataViewerFallback;
