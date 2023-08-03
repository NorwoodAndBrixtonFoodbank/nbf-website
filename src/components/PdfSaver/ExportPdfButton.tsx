"use client";

import React from "react";
import jsPDF from "jspdf";
import Button from "@mui/material/Button";

type AllHTMLElements = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

export type PdfProps = {
    pdfRef: React.RefObject<AllHTMLElements>;
    fileName?: string;
    buttonText?: string;
};

const getPaperSize = (pdfRef: React.RefObject<AllHTMLElements>): [number, number] => {
    const width = pdfRef.current!.offsetWidth;
    // aspect ratio of A4 is 1:√2
    const height = width * Math.SQRT2;
    return [width, height];
};

const ExportPdfButton: React.FC<PdfProps> = (props) => {
    const savePdf = (): void => {
        const doc = new jsPDF({
            orientation: "p",
            unit: "mm",
            format: getPaperSize(props.pdfRef),
            compress: true,
        });

        doc.html(props.pdfRef.current!, {
            async callback(doc) {
                await doc.save(props.fileName !== undefined ? props.fileName : "document.pdf");
            },
        });
    };
    return (
        <>
            <Button onClick={savePdf}>
                {props.buttonText !== undefined ? props.buttonText : "Save as PDF"}
            </Button>
        </>
    );
};

export default ExportPdfButton;
