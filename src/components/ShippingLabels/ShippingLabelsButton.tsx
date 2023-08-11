"use client";

import { NoSsr } from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
import ShippingLabelsPdf, { ParcelClients } from "@/components/ShippingLabels/ShippingLabelsPdf";

interface Props {
    data: ParcelClients[][];
    text: string;
}

const ShippingLabelsButton: React.FC<Props> = ({ data, text }) => {
    return (
        <NoSsr>
            <PDFDownloadLink
                document={<ShippingLabelsPdf data={data} />}
                fileName="ShippingLabels.pdf"
            >
                {text}
            </PDFDownloadLink>
        </NoSsr>
    );
};

export default ShippingLabelsButton;
