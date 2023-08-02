"use client";

import React, { ReactElement } from "react";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";

type valueType = string[] | string | number | boolean | null;

export interface Data {
    [key: string]: valueType;
}

const Key = styled.div`
    color: ${(props) => props.theme.primary.foreground[1]};
    background-color: ${(props) => props.theme.primary.background[1]};

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

export interface DataViewerProps {
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
