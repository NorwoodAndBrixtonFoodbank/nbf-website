import React from "react";
import { FormSubheading, FormText, StyledCard } from "@/components/Form/formStyling";
import styled from "styled-components";

interface Props {
    title: string;
    required: boolean;
    children: React.ReactElement;
    text?: string;
}

const RequiredAsterisk = styled.span`
    color: ${(props) => props.theme.errorColor};

    &:before {
        content: "*";
    }
`;

const GenericFormCard: React.FC<Props> = (props: Props) => {
    return (
        <StyledCard>
            <FormSubheading>
                {props.title} {props.required && <RequiredAsterisk />}
            </FormSubheading>
            {props.text && <FormText>{props.text}</FormText>}
            {props.children}
        </StyledCard>
    );
};

export default GenericFormCard;
