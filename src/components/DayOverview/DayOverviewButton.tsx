"use client";

import { NoSsr } from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
import DayOverviewPdf from "@/components/DayOverview/DayOverviewPdf";
import { ParcelOfSpecificDateLocation } from "@/components/DayOverview/DayOverview";

interface DayOverviewerButtonProps {
    date: Date;
    location: string;
    data: ParcelOfSpecificDateLocation[];
    text: string;
}
const DayOverviewButton: React.FC<DayOverviewerButtonProps> = ({ date, location, data, text }) => {
    return (
        <>
            <NoSsr>
                <PDFDownloadLink
                    document={<DayOverviewPdf date={date} location={location} data={data} />}
                    fileName="DayOverview.pdf"
                >
                    {text}
                </PDFDownloadLink>
            </NoSsr>
        </>
    );
};

export default DayOverviewButton;
