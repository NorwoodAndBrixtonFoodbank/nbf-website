import React from "react";
import Icon from "@/components/Icons/Icon";
import { faComment } from "@fortawesome/free-solid-svg-icons";

interface Props {
    onHoverText?: string;
    color?: string;
    popper?: boolean;
}

const SpeechBubbleIcon: React.FC<Props> = (props) => {
    return (
        <Icon
            color={props.color}
            icon={faComment}
            onHoverText={props.onHoverText}
            popper={props.popper}
        />
    );
};

export default SpeechBubbleIcon;
