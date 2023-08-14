"use client";

import { Metadata } from "next";
import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import DriverOverviewCard, {
    DriverOverviewTableData,
} from "@/components/DriverOverview/DriverOverview";

const fakeData: DriverOverviewTableData[] = [
    {
        name: "Tom Cusack",
        address: {
            line1: "1 Fake Street",
            line2: "Fake Town",
            town: "Fake Town",
            county: "Fake County",
            postcode: "FAKE 1",
        },
        packingDate: new Date(2023, 8, 21),
        parcels: 5,
        instructions: "Please be careful with the fragile items",
    },
    {
        name: "Tom Tactical",
        address: {
            line1: "1 Fake Street",
            line2: "Fake Town",
            town: "Fake Town",
            county: "Fake County",
            postcode: "FAKE 1",
        },
        contact: "0123456789",
        packingDate: new Date(2023, 8, 21),
        parcels: 5,
        instructions: "Please be careful with the fragile items",
    },
    {
        name: "Tom Terrific",
        address: {
            line1: "1 Super Incredibly Long Street Name that is really unnecessary just to test how it works",
            line2: "Fake Town",
            town: "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch",
            county: "Fake County",
            postcode: "FAKE 1",
        },
        contact: "0123456789",
        packingDate: new Date(2023, 8, 21),
        parcels: 2432,
        instructions: "Please be careful with the fragile items",
    },
    {
        name: "Tom Awesome",
        address: {
            line1: "1 Fake Street",
            line2: "Fake Town",
            town: "Fake Town",
            county: "Fake County",
            postcode: "FAKE 1",
        },
        contact: "0123456789",
        packingDate: new Date(2023, 8, 21),
        parcels: "None",
        instructions: "Please be careful with the fragile items",
    },
    ...Array.from({ length: 20 }, () => ({
        name: "Tom Cusack",
        address: {
            line1: "1 Fake Street",
            line2: "Fake Town",
            town: "Fake Town",
            county: "Fake County",
            postcode: "FAKE 1",
        },
        contact: Math.floor(Math.random() * (9999999999 - 1000000000 + 1) + 1000000000).toString(),
        packingDate: new Date(2023, 8, 21),
        parcels: 5,
        instructions: "Please be careful with the fragile items",
    })),
];

const Clients: React.FC = () => {
    const date = new Date(2023, 8, 21);
    return (
        <main>
            <PDFViewer width={1000} height={1200}>
                <DriverOverviewCard driverName="Tom Cusack" date={date} data={fakeData} />
            </PDFViewer>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Clients",
};

export default Clients;
