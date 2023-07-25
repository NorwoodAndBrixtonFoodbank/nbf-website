"use client";

import React, { ReactElement } from "react";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";

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
        const booleanString = value.toString();
        return booleanString[0].toUpperCase() + booleanString.slice(1);
    }

    return value!.toString();
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
    ariaLabel?: string;
}

const DataViewer: React.FC<DataViewerProps> = (props) => {
    const closeModal = (): void => {
        props.onRequestClose();
    };

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={closeModal}
            header={props.header}
            ariaLabel={props.ariaLabel}
        >
            <ContentDiv>{JSONContent(props.data)}</ContentDiv>
        </Modal>
    );
};
export default DataViewer;
