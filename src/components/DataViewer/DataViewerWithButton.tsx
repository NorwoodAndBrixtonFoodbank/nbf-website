"use client";
import React, { useState } from "react";
import DataViewer from "@/components/DataViewer/DataViewer";

interface ViewerProps {
    data: { [key: string]: string | number | null };
}

const DataViewerWithButton: React.FC<ViewerProps> = ({ data }) => {
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const openModal: () => void = () => {
        setViewerIsOpen(true);
        console.log("openModal", viewerIsOpen);
    };

    const closeModal: () => void = () => {
        setViewerIsOpen(false);
    };

    return (
        <>
            <button onClick={openModal}>Open</button>
            <DataViewer
                data={data}
                title="Client details"
                isOpen={viewerIsOpen}
                onRequestClose={closeModal}
            />
        </>
    );
};

export default DataViewerWithButton;
