import React from "react";
import Icon from "@/components/Icons/Icon";
import { faComment } from "@fortawesome/free-solid-svg-icons";

interface Props {
    onHoverText?: string;
    color?: string;
}
const SpeechBubbleIcon: React.FC<Props> = (props) => {
    return <Icon icon={faComment} onHoverText={props.onHoverText} color={props.color} />;
};

export default SpeechBubbleIcon;
