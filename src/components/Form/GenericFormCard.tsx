"use client";

import React from "react";
import { FormSubheading, FormText, StyledCard } from "@/components/Form/formStyling";
import styled from "styled-components";

interface Props {
    title: string;
    required: boolean;
    children: React.ReactNode;
    text?: string;
}

const RequiredAsterisk = styled.span`
    color: ${(props) => props.theme.error};

    &:before {
        content: "*";
    }
`;

const GenericFormCard: React.FC<Props> = (props: Props) => {
    return (
        <StyledCard elevation={3}>
            <FormSubheading>
                {props.title} {props.required && <RequiredAsterisk />}
            </FormSubheading>
            {props.text && <FormText>{props.text}</FormText>}
            {props.children}
        </StyledCard>
    );
};

export default GenericFormCard;
