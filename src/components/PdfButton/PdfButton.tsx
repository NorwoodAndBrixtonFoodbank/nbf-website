"use client";

import { NoSsr, Button } from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";

interface Props<T> {
    data: T;
    text: string;
    pdfComponent: React.FC<{ data: T }>;
    fileName: string;
    formatName?: boolean;
}

const makePaddedString = (inputNumber: number): string => {
    return inputNumber.toString().padStart(2, "0");
};

const filenameTimestampNow = (): string => {
    const now = new Date();

    const year = now.getFullYear().toString();
    const month = makePaddedString(now.getMonth() + 1);
    const day = makePaddedString(now.getDate());
    const hours = makePaddedString(now.getHours());
    const minutes = makePaddedString(now.getMinutes());
    const seconds = makePaddedString(now.getSeconds());

    return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
};

export const formatFileName = (fileName: string): string => {
    const newFileName = fileName.endsWith(".pdf") ? fileName.slice(0, -4) : fileName;
    return `${newFileName}_${filenameTimestampNow()}.pdf`;
};

const PdfButton = <T,>({
    data,
    text,
    pdfComponent: PdfComponent,
    fileName,
    formatName = true,
}: Props<T>): React.ReactElement => {
    return (
        <NoSsr>
            <PDFDownloadLink
                document={<PdfComponent data={data} />}
                fileName={formatName ? formatFileName(fileName) : fileName}
            >
                <Button variant="contained">{text}</Button>
            </PDFDownloadLink>
        </NoSsr>
    );
};

export default PdfButton;
