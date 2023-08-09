"use client";

import React, { useRef } from "react";
import { ParcelCard, ParcelClients } from "@/app/shippings/parcelCard";
import ExportPdfButton from "@/components/PdfSaver/ExportPdfButton";
import { styled } from "styled-components";

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
    const parcelRef = useRef<HTMLDivElement | null>(null);
    const total = data.length;

    return (
        <>
            <Centerer>
                <ExportPdfButton pdfRef={parcelRef} />
            </Centerer>
            <Centerer>
                <PdfWrapper ref={parcelRef}>
                    {data.map((parcel: ParcelClients, index: number) => {
                        return (
                            <ParcelCard
                                key={parcel.primary_key}
                                parcel={parcel}
                                index={index + 1}
                                total={total}
                            />
                        );
                    })}
                </PdfWrapper>
            </Centerer>
        </>
    );
};

export default ShippingParcels;
