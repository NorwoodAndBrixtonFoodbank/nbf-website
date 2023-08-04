import React from "react";
import Icon from "@/components/Icons/Icon";
import { faComment } from "@fortawesome/free-solid-svg-icons";

interface Props {
    onHoverText?: string;
    color?: string;
    showTooltip?: boolean;
    onTooltipClose?: () => void;
}

const SpeechBubbleIcon: React.FC<Props> = (props) => {
    return (
        <Icon
            color={props.color}
            icon={faComment}
            onHoverText={props.onHoverText}
            showTooltip={props.showTooltip}
            onTooltipClose={props.onTooltipClose}
        />
    );
};

export default SpeechBubbleIcon;
