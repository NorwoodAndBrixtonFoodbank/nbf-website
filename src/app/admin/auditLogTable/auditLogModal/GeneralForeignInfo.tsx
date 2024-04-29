"use client";

import React, { useEffect, useState } from "react";
import { AuditLogModalItem, TextValueContainer, Key } from "./AuditLogModal";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import { ForeignResponse } from "./types";

interface GeneralForeignInfoProps<ForeignData, ForeignError> {
    foreignKey: string;
    fetchResponse: (foreignKey: string) => Promise<ForeignResponse<ForeignData, ForeignError>>;
    getErrorMessage: (error: ForeignError) => string;
    SpecificInfoComponent: React.FC<ForeignData>;
    header: string;
}

const GeneralForeignInfo = <ForeignData, ForeignError>({
    foreignKey,
    fetchResponse,
    getErrorMessage,
    SpecificInfoComponent,
    header
}: GeneralForeignInfoProps<ForeignData, ForeignError>): React.ReactElement => {
    const [foreignData, setForeignData] = useState<ForeignData | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { data, error } = await fetchResponse(foreignKey);
            if (error) {
                setErrorMessage(getErrorMessage(error));
                return;
            }
            setForeignData(data);
        })();
    }, [foreignKey, fetchResponse, getErrorMessage]);

    return (
        <AuditLogModalItem>
            <Key>{header.toUpperCase()}: </Key>
            {foreignData && <SpecificInfoComponent {...foreignData} />}
            {errorMessage && (
                <TextValueContainer>
                    <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>
                </TextValueContainer>
            )}
        </AuditLogModalItem>
    );
};

export default GeneralForeignInfo;
