"use client";

import React from "react";
import Icon from "@/components/Icons/Icon";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const StyledSpan = styled.span`
    color: red;
`;

const FlagIcon: React.FC = () => {
    return (
        <StyledSpan>
            <Icon icon={faFlag} onHoverText={"Flagged for attention"} />
        </StyledSpan>
    );
};

export default FlagIcon;
