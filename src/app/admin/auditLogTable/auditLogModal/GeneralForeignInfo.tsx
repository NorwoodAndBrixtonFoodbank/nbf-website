"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import LinkButton from "@/components/Buttons/LinkButton";
import { AuditLogModalItem, TextValueContainer, Key, LinkContainer } from "./AuditLogModal";
import dayjs from "dayjs";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import { ForeignResponse } from "./types";

interface GeneralForeignInfoProps <ForeignData, ForeignError>{
    foreignKey: string;
    fetchResponse: (foreignKey: string) => Promise<ForeignResponse<ForeignData, ForeignError>>
    getErrorMessage: (error: ForeignError) => string
    SpecificInfoComponent: React.FC<{foreignData: ForeignData}>;

}

const GeneralForeignInfo = <ForeignData,ForeignError>({ foreignKey, fetchResponse, getErrorMessage, SpecificInfoComponent }: GeneralForeignInfoProps<ForeignData,ForeignError>): React.ReactElement => {
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
    }, [foreignKey]);

    return (
        <AuditLogModalItem>
            <Key>PARCEL: </Key>
            {foreignData && 
                <SpecificInfoComponent foreignData={foreignData}/>
            }
            {errorMessage && (
                <TextValueContainer>
                    <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>
                </TextValueContainer>
            )}
        </AuditLogModalItem>
    );
};

export default GeneralForeignInfo;
