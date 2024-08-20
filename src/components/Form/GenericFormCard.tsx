"use client";

import React from "react";
import {
    FormSubheading,
    FormText,
    StyledCard,
    FormHeader,
    FormInput,
    RequiredAsterisk,
} from "@/components/Form/formStyling";

interface Props {
    title: string;
    required: boolean;
    children: React.ReactNode;
    text?: string;
    compactVariant?: boolean;
}

const GenericFormCard: React.FC<Props> = (props: Props) => {
    return (
        <StyledCard elevation={3} $compact={props.compactVariant}>
            <FormHeader $compact={props.compactVariant}>
                <FormSubheading>
                    {props.title} {props.required && <RequiredAsterisk />}
                </FormSubheading>
                {props.text && <FormText>{props.text}</FormText>}
            </FormHeader>
            <FormInput $compact={props.compactVariant}>{props.children}</FormInput>
        </StyledCard>
    );
};

export default GenericFormCard;
