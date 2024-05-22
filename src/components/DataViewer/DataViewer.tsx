"use client";

import React from "react";
import styled from "styled-components";
import { formatCamelCaseKey } from "@/common/format";

type valueType = string[] | string | number | boolean | null;

export interface Data {
    [key: string]: valueType;
}

export const DataViewerContainer = styled.div`
    width: 800px;
    max-width: 100%;

    display: flex;
    flex-direction: column;
`;

export const DataViewerItem = styled.div`
    display: flex;
    flex-direction: row;
    padding-bottom: 0.5em;
`;

const Key = styled.div`
    flex: 0 0 30%;
    font-weight: 600;
    padding: 0.2em 0.5em;
`;

const Value = styled.div`
    padding: 0.2em 0.5em;
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
    fieldsToHide?: Partial<[keyof Data]>;
}

const DataViewer: React.FC<DataViewerProps> = ({ data, fieldsToHide = [] }) => {
    return (
        <DataViewerContainer>
            {Object.entries(data).map(([key, value]) => {
                if (!fieldsToHide.includes(key)) {
                    return (
                        <DataViewerItem key={key}>
                            <Key>{formatCamelCaseKey(key)}</Key>
                            <Value>{formatDisplayValue(value)}</Value>
                        </DataViewerItem>
                    );
                }
            })}
        </DataViewerContainer>
    );
};
export default DataViewer;
