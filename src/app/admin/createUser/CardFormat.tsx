"use client";

import React from "react";
import { FormSubheading, FormText, UserFormStyledCard } from "@/components/Form/formStyling";
import {
    RequiredAsterisk,
    LeftColumn,
    RightColumn,
} from "@/app/admin/createUser/cardFormatStyling";

interface Props {
    title: string;
    required: boolean;
    children: React.ReactNode;
    text?: string;
}

const UserFormCard: React.FC<Props> = (props: Props) => {
    return (
        <UserFormStyledCard elevation={3}>
            <LeftColumn>
                <FormSubheading>
                    {props.title} {props.required && <RequiredAsterisk />}
                </FormSubheading>
                {props.text && <FormText>{props.text}</FormText>}
            </LeftColumn>
            <RightColumn>{props.children}</RightColumn>
        </UserFormStyledCard>
    );
};

export default UserFormCard;
