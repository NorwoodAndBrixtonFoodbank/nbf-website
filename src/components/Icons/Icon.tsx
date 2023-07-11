"use client";

import React from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

interface Props {
    icon: IconDefinition;
    color?: string;
    onHoverText?: string;
}

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
    width: 1em;
    height: 1em;
    margin: 0.125em;
    color: ${(props) => props.color};
`;

const Icon: React.FC<Props> = (props) => {
    return (
        <StyledFontAwesomeIcon icon={props.icon} title={props.onHoverText} color={props.color} />
    );
};

export default Icon;
