"use client";

import { NoSsr, Button } from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import React from "react";
import { saveAs } from "file-saver";
import { PdfDataFetchResponse } from "@/pdf/common";

interface Props<Data, ErrorType extends string> {
    fetchDataAndFileName: () => Promise<PdfDataFetchResponse<Data, ErrorType>>;
    pdfComponent: React.FC<{ data: Data }>;
    onPdfCreationCompleted: () => void;
    formatName?: boolean;
    disabled?: boolean;
    onPdfCreationFailed: (error: { type: ErrorType; logId: string }) => void;
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

const formatFileName = (fileName: string): string => {
    const newFileName = fileName.endsWith(".pdf") ? fileName.slice(0, -4) : fileName;
    return `${newFileName}_${filenameTimestampNow()}.pdf`;
};

const PdfButton = <Data, ErrorType extends string>({
    fetchDataAndFileName,
    pdfComponent: PdfComponent,
    onPdfCreationCompleted = () => undefined,
    formatName = true,
    disabled = false,
    onPdfCreationFailed,
}: Props<Data, ErrorType>): React.ReactElement => {
    const onClick = async (): Promise<void> => {
        const { data, error } = await fetchDataAndFileName();
        if (error) {
            onPdfCreationFailed(error);
            return;
        }
        const blob = await pdf(<PdfComponent data={data.pdfData} />).toBlob();
        saveAs(blob, formatName ? formatFileName(data.fileName) : data.fileName);
        onPdfCreationCompleted();
    };
    return (
        <NoSsr>
            <Button variant="contained" onClick={onClick} disabled={disabled}>
                Download PDF
            </Button>
        </NoSsr>
    );
};

export default PdfButton;
