"use client";

import React, { ReactElement } from "react";
import styled from "styled-components";
import Modal from "@/components/Modal/Modal";

export interface Data {
    [key: string]: string | number | null;
}

const Key = styled.div`
    color: ${(props) => props.theme.foregroundColor};
    background-color: ${(props) => props.theme.secondaryBackgroundColor}40;
    display: inline-block;
    font-size: medium;
    border-radius: 0.7em;
    padding: 0.2em 0.5em 0.2em 0.5em;
`;

const Value = styled.div`
    font-size: medium;
    padding: 0.2em 0.5em 0.2em 0.5em;
`;

const EachItem = styled.div`
    padding-bottom: 1rem;
`;

const JSONContent: React.FC<Data> = (data) => {
    return (
        <>
            {Object.entries(data).map(([key, value]) => (
                <EachItem key={key}>
                    <Key>{key.toUpperCase().replace("_", " ")}</Key>
                    <Value>{value ?? ""}</Value>
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
            {JSONContent(props.data)}
        </Modal>
    );
};
export default DataViewer;
