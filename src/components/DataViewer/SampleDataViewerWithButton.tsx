"use client";
import React, { useState } from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import PhoneIcon from "../Icons/PhoneIcon";
import styled from "styled-components";

interface ViewerProps {
    data: { [key: string]: string | number | null };
}

const Header = styled.span`
    display: flex;
    align-items: center;
`;

const Title = styled.span`
    margin-left: 0.5rem;
`;

const SampleDataViewerWithButton: React.FC<ViewerProps> = ({ data }) => {
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const openModal: () => void = () => {
        setViewerIsOpen(true);
    };

    const closeModal: () => void = () => {
        setViewerIsOpen(false);
    };

    return (
        <>
            <button onClick={openModal}>Open</button>
            <DataViewer
                data={data}
                header={
                    <Header>
                        <PhoneIcon />
                        <Title>Client Details</Title>
                    </Header>
                }
                isOpen={viewerIsOpen}
                onRequestClose={closeModal}
            />
        </>
    );
};

export default SampleDataViewerWithButton;
