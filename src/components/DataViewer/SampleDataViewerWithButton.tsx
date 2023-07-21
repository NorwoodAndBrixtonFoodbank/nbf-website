"use client";
import React, { useState } from "react";
import DataViewer, { Data } from "@/components/DataViewer/DataViewer";
import styled from "styled-components";

interface ViewerProps {
    data: Data;
}

const Header = styled.span`
    display: flex;
    align-items: center;
`;

const Title = styled.span`
    margin-left: 0.5rem;
`;

const SampleDataViewerWithButton: React.FC<ViewerProps> = ({ data }: { data: any }) => {
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const openModal = (): void => {
        setViewerIsOpen(true);
    };

    const closeModal = (): void => {
        setViewerIsOpen(false);
    };

    return (
        <div id="modal-parent">
            <button onClick={openModal}>Open</button>
            <DataViewer
                data={data}
                header={
                    <Header>
                        <Title>Client Details</Title>
                    </Header>
                }
                isOpen={viewerIsOpen}
                onRequestClose={closeModal}
            />
        </div>
    );
};

export default SampleDataViewerWithButton;
