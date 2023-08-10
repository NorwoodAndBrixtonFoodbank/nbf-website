"use client";

import { Button, NoSsr } from "@mui/material";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import React from "react";
import ShippingLabelsPdf, { ParcelClients } from "@/app/shippings/shippingLabelsPdf";

const ShippingParcels: React.FC<{ data: ParcelClients[][] }> = ({ data }) => {
    return (
        <>
            <NoSsr>
                <PDFDownloadLink
                    document={<ShippingLabelsPdf data={data} />}
                    fileName="hotdogsaregoodforyou.pdf"
                >
                    <Button>Hi</Button>
                </PDFDownloadLink>
                <PDFViewer width="1000" height="1200">
                    <ShippingLabelsPdf data={data} />
                </PDFViewer>
            </NoSsr>
        </>
    );
};

export default ShippingParcels;
