"use client";

import { NoSsr, Button } from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import React, { useEffect } from "react";
import { saveAs } from "file-saver";

interface Props<T> {
    fetchDataAndFileName: () => Promise<{ data: T; fileName: string }>;
    text: string;
    pdfComponent: React.FC<{ data: T }>;
    clickHandler?: () => void;
    formatName?: boolean;
    disabled?: boolean;
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

const PdfButton = <T,>({
    fetchDataAndFileName,
    text,
    pdfComponent: PdfComponent,
    clickHandler = () => {},
    formatName = true,
    disabled = false,
}: Props<T>): React.ReactElement => {
    const onClick = async (): Promise<void> => {
        clickHandler();
        const { data, fileName } = await fetchDataAndFileName();
        const blob = await pdf(<PdfComponent data={data} />).toBlob();
        saveAs(blob, formatName ? formatFileName(fileName) : fileName);
    };
    useEffect(() => {
        console.log(disabled);
    }, [disabled]);
    return (
        <NoSsr>
            <Button variant="contained" onClick={onClick} disabled={disabled}>
                {text}
            </Button>
        </NoSsr>
    );
};

export default PdfButton;
