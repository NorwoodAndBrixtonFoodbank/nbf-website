"use client";

import React from "react";
import { jsPDF } from "jspdf";

export type PdfProps = {
    pdfRef: React.MutableRefObject<HTMLInputElement | null>
}

const getPaperSize = (pdfRef: React.MutableRefObject<HTMLInputElement | null>) => { // aspect ratio of A4 is 1:√2
    const width = pdfRef.current!.offsetWidth;
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
            <button onClick={savePdf}>Save as PDF</button>
        </>
    );
};

export default ExportPdfButton;

