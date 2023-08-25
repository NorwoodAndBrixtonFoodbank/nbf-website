"use client";

import React, { useState, useEffect } from "react";
import LinkButton from "@/components/Buttons/LinkButton";
import styled from "styled-components";
import { CenterComponent, StyledCard } from "@/components/Form/formStyling";
import getClientData, { ClientData } from "@/app/clients/[id]/getClientData";
import { formatCamelCaseKey } from "@/common/format";

interface Props {
    clientID: string;
}

const NormalText = styled.pre`
    font-family: inherit;
    font-weight: normal;
    padding-bottom: 1rem;
    width: inherit;
    word-break: break-word;
`;

const KeyText = styled.p`
    font-weight: bold;
`;

const ViewClientPage: React.FC<Props> = ({ clientID }) => {
    const [clientData, setClientData] = useState<ClientData | null>(null);

    useEffect(() => {
        getClientData(clientID).then(setClientData);
    }, [clientID]);

    if (!clientData) {
        return <></>;
    }

    return (
        <CenterComponent>
            <StyledCard>
                {Object.entries(clientData).map(([objectKey, objectValue], index) => (
                    <div key={index}>
                        <KeyText>{formatCamelCaseKey(objectKey)}</KeyText>
                        <NormalText>{objectValue}</NormalText>
                    </div>
                ))}
                <LinkButton link={`/clients/edit/${clientID}`}>Edit</LinkButton>
                <LinkButton link={`/parcels/add/${clientID}`}>Continue</LinkButton>
                <LinkButton link="/clients">Back</LinkButton>
            </StyledCard>
        </CenterComponent>
    );
};

export default ViewClientPage;
