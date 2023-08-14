"use client";

import { NoSsr } from "@mui/material";
import { PDFViewer } from "@react-pdf/renderer";
import React from "react";
import DayOverviewerPdf from "@/components/DayOverview/DayOverviewerPdf";
import { ParcelOfSpecificDate } from "@/components/DayOverview/DayOverviewer";

interface DayOverviewerButtonProps {
    date: Date;
    location: string;
    data: ParcelOfSpecificDate[];
}
const DayOverviewerButton: React.FC<DayOverviewerButtonProps> = ({ date, location, data }) => {
    return (
        <>
            <NoSsr>
                <PDFViewer width="1000" height="1200">
                    <DayOverviewerPdf date={date} location={location} data={data} />
                </PDFViewer>
            </NoSsr>
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </>
    );
};

export default DayOverviewerButton;
