import React from "react";
import Icon from "@/components/Icons/Icon";
import { faComment } from "@fortawesome/free-solid-svg-icons";

interface Props {
    onHoverText?: string;
}
const SpeechBubbleIcon: React.FC<Props> = (props) => {
    return <Icon icon={faComment} onHoverText={props.onHoverText} color={"blue"} />;
};

export default SpeechBubbleIcon;
