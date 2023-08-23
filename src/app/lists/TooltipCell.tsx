"use client";

import SpeechBubbleIcon from "@/components/Icons/SpeechBubbleIcon";
import React, { useState } from "react";
import styled, { useTheme } from "styled-components";

const CellDiv = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
`;

interface Props {
    cellValue: string;
    tooltipValue?: string;
}

const TooltipCell: React.FC<Props> = (props) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const theme = useTheme();

    if (!props.tooltipValue) {
        return <>{props.cellValue}</>;
    }

    return (
        <CellDiv
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(true)}
        >
            {props.cellValue}
            <SpeechBubbleIcon
                onHoverText={props.tooltipValue}
                showTooltip={showTooltip}
                color={theme.accent.background}
            />
        </CellDiv>
    );
};

export default TooltipCell;
