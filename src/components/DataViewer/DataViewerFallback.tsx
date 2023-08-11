import React from "react";
import { Skeleton } from "@mui/material";
import styled from "styled-components";

const SkeletonKey = styled(Skeleton)`
    display: inline-block;
    color: transparent;
    border-radius: 0.7em;
    padding: 0.2em 0.5em;
`;

const SkeletonValue = styled(Skeleton)`
    padding: 0.2em 0.5em;
`;

const SkeletonItem = styled.div`
    padding-bottom: 1em;
`;

const SkeletonDiv = styled.div`
    width: 1000px;
    max-width: 100%;
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
        <SkeletonDiv>
            {fieldPlaceholders.map((placeholder, index) => {
                return (
                    <SkeletonItem key={index}>
                        <SkeletonKey variant="text">{placeholder}</SkeletonKey>
                        <SkeletonValue variant="text" width={200} />
                    </SkeletonItem>
                );
            })}
        </SkeletonDiv>
    );
};

export default DataViewerFallback;
