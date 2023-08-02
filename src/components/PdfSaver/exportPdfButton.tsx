"use client";

import React from "react";
import { jsPDF } from "jspdf";
import { styled } from "styled-components";

const StyledButton = styled.button`
    text-align: center;
    width: 150px;
    height: 40px;
    border-radius: 10px;
    border: solid 0 ${(props) => props.theme.foregroundColor};
    background-color: ${(props) => props.theme.primaryBackgroundColor};
    color: ${(props) => props.theme.primaryForegroundColor};

    &:hover {
        background-color: ${(props) => props.theme.secondaryBackgroundColor};
        color: ${(props) => props.theme.secondaryForegroundColor};
    }
`;

export type PdfProps = {
    pdfRef: React.MutableRefObject<HTMLInputElement | null>
}

const getPaperSize = (pdfRef: React.MutableRefObject<HTMLInputElement | null>) => {
    const width = pdfRef.current!.offsetWidth;
    // aspect ratio of A4 is 1:√2
    const height = width * Math.SQRT2;
    return [width, height]
}

const ExportPdfButton: React.FC<PdfProps> = (props) => {
    
    const savePdf = () => {        
        const doc = new jsPDF(
            {
                orientation: 'p',
                unit: 'mm',
                format: getPaperSize(props.pdfRef),
                compress: true,
            }
        );

        doc.html(props.pdfRef.current!, {
            async callback(doc) {
                await doc.save("document");
            },
        });
    };
    return (
        <>
            <StyledButton onClick={savePdf}>Save as PDF</StyledButton>
        </>
    );
};

export default ExportPdfButton;

