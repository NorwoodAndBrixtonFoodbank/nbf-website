"use client";

import { NoSsr } from "@mui/material";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import React from "react";
import DayOverviewPdf from "@/components/DayOverview/DayOverviewPdf";
import { ParcelOfSpecificDateLocation } from "@/components/DayOverview/DayOverview";
import { Schema } from "@/supabase";

interface DayOverviewerButtonProps {
    date: Date;
    location: string;
    data: ParcelOfSpecificDateLocation[];
    text: string;
}

const collectionCentreToAbbreviation = (
    collectionCentre: Schema["parcels"]["collection_centre"]
): string => {
    switch (collectionCentre) {
        case "Brixton Hill - Methodist Church":
            return "BH_MC";
        case "Clapham - St Stephens Church":
            return "CLP_SC";
        case "N&B - Emmanuel Church":
            return "NAB_EC";
        case "Streatham - Immanuel & St Andrew":
            return "STM_IS";
        case "Vauxhall Hope Church":
            return "VHC";
        case "Waterloo - Oasis":
            return "WAT_OA";
        case "Waterloo - St George the Martyr":
            return "WAT_SG";
        case "Waterloo - St Johns":
            return "WAT_SJ";
        case "Delivery":
            return "Delivery";
        default:
            return "-";
    }
};

const DayOverviewButton: React.FC<DayOverviewerButtonProps> = ({ date, location, data, text }) => {
    const dateString = date.toLocaleDateString("sv-SE").split("-").join("");
    return (
        <NoSsr>
            <PDFDownloadLink
                document={<DayOverviewPdf date={date} location={location} data={data} />}
                fileName={`DayOverview_${dateString}_${collectionCentreToAbbreviation(
                    location
                )}.pdf`}
            >
                {text}
            </PDFDownloadLink>
            <PDFViewer width="400" height="500">
                <DayOverviewPdf date={date} location={location} data={data} />
            </PDFViewer>
        </NoSsr>
    );
};

export default DayOverviewButton;
