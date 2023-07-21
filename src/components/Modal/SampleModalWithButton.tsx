"use client";
import React, { useState } from "react";
import DataViewer, { Data } from "@/components/DataViewer/DataViewer";
import PhoneIcon from "@/components/Icons/PhoneIcon";
import Modal from "@/components/Modal/Modal";
import styled from "styled-components";

const Key = styled.div`
    color: grey;
    font-size: small;
`;
const Value = styled.div`
    font-size: medium;
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

const SampleModalWithButton: React.FC<{}> = ({ data }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = (): void => {
        setModalIsOpen(true);
    };

    const closeModal = (): void => {
        setModalIsOpen(false);
    };

    return (
        <>
            <button onClick={openModal}>Open</button>
            <Modal header={<div>Header</div>} isOpen={modalIsOpen} onClose={closeModal}>
                {JSONContent(data)}
            </Modal>
        </>
    );
};

export default SampleModalWithButton;
