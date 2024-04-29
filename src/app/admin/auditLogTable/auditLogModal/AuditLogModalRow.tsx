"use client";

import React, { useEffect, useState } from "react";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import { AuditLogModalRowResponse } from "./types";
import styled from "styled-components";

export const AuditLogModalItem = styled.div`
    display: flex;
    flex-direction: row;
    padding-bottom: 0.5em;
`;

export const Key = styled.div`
    flex: 0 0 30%;
    font-weight: 600;
    padding: 1rem 0.5em;
    align-content: center;
`;

export const TextValueContainer = styled.div`
    padding: 1rem;
`;

interface AuditLogModalRowProps<Data, Error> {
    foreignKey: string;
    fetchResponse: (foreignKey: string) => Promise<AuditLogModalRowResponse<Data, Error>>;
    getErrorMessage: (error: Error) => string;
    RowComponentWhenSuccessful: React.FC<Data>;
    header: string;
}

const AuditLogModalRow = <Data, Error>({
    foreignKey,
    fetchResponse,
    getErrorMessage,
    RowComponentWhenSuccessful,
    header,
}: AuditLogModalRowProps<Data, Error>): React.ReactElement => {
    const [rowData, setRowData] = useState<Data | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { data, error } = await fetchResponse(foreignKey);
            if (error) {
                setErrorMessage(getErrorMessage(error));
                return;
            }
            setRowData(data);
        })();
    }, [foreignKey, fetchResponse, getErrorMessage]);

    return (
        <AuditLogModalItem>
            <Key>{header.toUpperCase()}: </Key>
            {rowData && <RowComponentWhenSuccessful {...rowData} />}
            {errorMessage && (
                <TextValueContainer>
                    <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>
                </TextValueContainer>
            )}
        </AuditLogModalItem>
    );
};

export default AuditLogModalRow;
