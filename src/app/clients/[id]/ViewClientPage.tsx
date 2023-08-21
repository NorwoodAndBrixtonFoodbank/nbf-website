"use client";

import React from "react";
import LinkButton from "@/components/Buttons/LinkButton";
import styled from "styled-components";
import { CenterComponent, StyledCard } from "@/components/Form/formStyling";
import { ClientData } from "@/app/clients/[id]/getClientData";
import { formatCamelCaseKey } from "@/pdf/ShoppingList/dataPreparation";

interface Props {
    clientID: string;
    clientData: ClientData;
}

const NormalText = styled.pre`
    font-family: inherit;
    font-weight: normal;
    padding-bottom: 1rem;
    width: inherit;
    word-break: break-word;
`;

const TempDiv = styled.div`
    display: flex;
    flex-direction: column;
    place-items: baseline;
    width: inherit;
`;

const KeyText = styled.p`
    font-weight: bold;
`;

const ViewClientPage: React.FC<Props> = ({ clientID, clientData }) => {
    return (
        <CenterComponent>
            <StyledCard>
                <TempDiv>
                    {Object.entries(clientData).map(([objectKey, objectValue], index) => (
                        <TempDiv key={index}>
                            <KeyText>{formatCamelCaseKey(objectKey)}</KeyText>
                            <NormalText>{objectValue as string}</NormalText>
                        </TempDiv>
                    ))}
                    <LinkButton link={`/clients/add/${clientID}`}>Edit</LinkButton>
                    <LinkButton link={`/parcels/add/${clientID}`}>Continue</LinkButton>
                    <LinkButton link="/clients">Back</LinkButton>
                </TempDiv>
            </StyledCard>
        </CenterComponent>
    );
};

export default ViewClientPage;
