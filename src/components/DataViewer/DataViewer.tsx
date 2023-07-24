"use client";

import React, { ReactElement } from "react";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";

export interface Data {
    [key: string]: string[] | string | number | boolean | null;
}

const Key = styled.div`
    // TODO VFB-16 Change to using theme with palettes of colours (dark font matching with this background)
    color: ${(props) => props.theme.foregroundColor};
    // TODO VFB-16 Change to using theme with palettes of colours
    background-color: ${(props) => props.theme.secondaryBackgroundColor}40;
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

const valueIsEmpty = (value: string[] | string | number | boolean | null): boolean => {
    return (Array.isArray(value) && value.length === 0) || value === "" || value === null;
};

const formatDisplayValue = (value: any): string => {
    if (valueIsEmpty(value)) {
        return "-";
    } else if (typeof value === "boolean") {
        const booleanString = value.toString();
        return booleanString[0].toUpperCase() + booleanString.slice(1);
    } else {
        return value.toString();
    }
};

const JSONContent: React.FC<Data> = (data) => {
    return (
        <>
            {Object.entries(data).map(([key, value]) => (
                <EachItem key={key}>
                    <Key>{key.toUpperCase().replace("_", " ")}</Key>
                    <Value>{formatDisplayValue(value)}</Value>
                </EachItem>
            ))}
        </>
    );
};

interface DataViewerProps {
    data: Data;
    header: ReactElement | string;
    isOpen: boolean;
    onRequestClose: () => void;
}

const DataViewer: React.FC<DataViewerProps> = (props) => {
    const closeModal = (): void => {
        props.onRequestClose();
    };

    return (
        <Modal isOpen={props.isOpen} onClose={closeModal} header={props.header}>
            <ContentDiv>{JSONContent(props.data)}</ContentDiv>
        </Modal>
    );
};
export default DataViewer;
