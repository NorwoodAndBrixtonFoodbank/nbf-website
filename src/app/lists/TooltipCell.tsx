import SpeechBubbleIcon from "@/components/Icons/SpeechBubbleIcon";
import React, { useState } from "react";
import { useTheme } from "styled-components";
import { RowDiv } from "@/components/Tables/Table";

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
        <RowDiv
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(true)}
        >
            {props.cellValue}
            <SpeechBubbleIcon
                onHoverText={props.tooltipValue}
                showTooltip={showTooltip}
                color={theme.accentBackgroundColor}
            />
        </RowDiv>
    );
};

export default TooltipCell;
