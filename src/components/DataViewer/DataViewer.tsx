"use client";

// TODO Refactor Data Viewer to be OUTSIDE of modal

import React from "react";
import styled from "styled-components";

type valueType = string[] | string | number | boolean | null;

export interface Data {
    [key: string]: valueType;
}

const Key = styled.div`
    // TODO VFB-16 Add a dark font colour (black perhaps) that is accessible with the colour below
    color: ${(props) => props.theme.secondaryForegroundColor};

    // TODO VFB-16 Add the equivalent of this colour (secondaryBackgroundColor}40) to a palette without the transparency
    background-color: ${(props) => props.theme.secondaryBackgroundColor};

    display: inline-block;
    border-radius: 0.7em;
    padding: 0.2em 0.5em;
`;

const Value = styled.div`
    padding: 0.2em 0.5em;
`;

const EachItem = styled.div`
    padding-bottom: 1em;
`;

const ContentDiv = styled.div`
    width: 1000px;
    max-width: 100%;
`;

const valueIsEmpty = (value: valueType): boolean => {
    return (Array.isArray(value) && value.length === 0) || value === "" || value === null;
};

const formatDisplayValue = (value: valueType): string => {
    if (valueIsEmpty(value)) {
        return "-";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return value!.toString();
};

interface DataViewerProps {
    data: Data;
}

const DataViewer: React.FC<DataViewerProps> = (props) => {
    return (
        <ContentDiv>
            {Object.entries(props.data).map(([key, value]) => (
                <EachItem key={key}>
                    <Key>{key.toUpperCase().replace("_", " ")}</Key>
                    <Value>{formatDisplayValue(value)}</Value>
                </EachItem>
            ))}
        </ContentDiv>
    );
};
export default DataViewer;
