"use client";
import supabase, { Schema } from "@/supabase";
import { Metadata } from "next";

import React, { useState } from "react";
import DataViewer from "@/components/DataViewer/DataViewer";

interface ViewerProps {
    data: { [key: string]: string | null };
}

const dataFetch: () => Promise<Schema["clients"][] | null> = async () => {
    const response = await supabase.from("clients").select();
    return response.data;
};

const Viewer: React.FC<ViewerProps> = ({ data }) => {
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
                title="Client details"
                isOpen={viewerIsOpen}
                onRequestClose={closeModal}
            />
        </>
    );
};

const Clients: () => Promise<React.ReactElement> = async () => {
    const data = await dataFetch();
    return (
        <main>
            <h1> Clients Page </h1>

            {/* This should be a separate component which is passed data via props */}
            {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}

            {data !== null && (
                <DataViewer
                    data={data[0]}
                    title="Client details"
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                />
            )}
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
