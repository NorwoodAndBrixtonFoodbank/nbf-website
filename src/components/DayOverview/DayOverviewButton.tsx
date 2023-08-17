"use client";

import { NoSsr } from "@mui/material";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import React from "react";
import DayOverviewPdf from "@/components/DayOverview/DayOverviewPdf";
import { DayOverviewData } from "@/components/DayOverview/DayOverview";

interface DayOverviewerButtonProps {
    data: DayOverviewData;
    text: string;
    fileName: string;
}

const DayOverviewButton: React.FC<DayOverviewerButtonProps> = ({ data, text, fileName }) => {
    return (
        <NoSsr>
            <PDFDownloadLink document={<DayOverviewPdf data={data} />} fileName={fileName}>
                {text}
            </PDFDownloadLink>
            <PDFViewer width="800" height="1000">
                <DayOverviewPdf data={data} />
            </PDFViewer>
        </NoSsr>
    );
};

export default DayOverviewButton;
