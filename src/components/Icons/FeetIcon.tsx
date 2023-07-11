"use client";
import React from "react";
import Icon from "@/components/Icons/Icon";
import { faShoePrints } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

interface Props {
    collectionPoint: string;
}

const StyledIcon = styled(Icon)`
    background-color: red;
`;

const FeetIcon: React.FC<Props> = (props) => {
    return (
        <StyledIcon icon={faShoePrints} onHoverText={`Collection at ${props.collectionPoint}`} />
    );
};

export default FeetIcon;
