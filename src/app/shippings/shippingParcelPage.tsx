"use client";

import { Button, NoSsr } from "@mui/material";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import React from "react";
import { styled } from "styled-components";
import ShippingLabelsPdf from "./shippingLabelsPdf";

export interface ParcelClients {
    primary_key: string;
    packing_datetime: string;
    collection_centre: string;
    collection_datetime: string;
    voucher_number: string;
    full_name?: string;
    phone_number?: string;
    address_1?: string;
    address_2?: string;
    address_town?: string;
    address_county?: string;
    address_postcode?: string;
    delivery_instructions?: string;
}

const Centerer = styled.div`
    margin: 0.5rem;
    display: flex;
    justify-content: center;

    & button {
        background-color: ${(props) => props.theme.primaryBackgroundColor};
        color: ${(props) => props.theme.secondaryForegroundColor};

        &:hover {
            background-color: ${(props) => props.theme.secondaryBackgroundColor};
            color: ${(props) => props.theme.secondaryForegroundColor};
        }
    }
`;

// TODO: discuss whether we want to default it to 1000px
const PdfWrapper = styled.div`
    // width: 100%;
    // max-width: 1000px;
    width: 1000px;
`;

const ShippingParcels: React.FC<{ data: ParcelClients[] }> = ({ data }) => {
    const total = data.length;

    return (
        <>
            <Centerer>
                <Button>CLICK ME</Button>
            </Centerer>

            <NoSsr>
                <PDFDownloadLink document={<ShippingLabelsPdf />} fileName="hotdogsaregoodforyou.pdf">
                    <Button>Hi</Button>
                </PDFDownloadLink>
                <PDFViewer width="1000" height="1200">
                    <ShippingLabelsPdf />
                </PDFViewer>
            </NoSsr>
        </>
    );
};

export default ShippingParcels;
