import React from "react";
import Icon from "@/components/Icons/Icon";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "styled-components";

interface Props {
    onHoverText?: string;
    color?: string;
    popper?: boolean;
}
const SpeechBubbleIcon: React.FC<Props> = (props) => {
    const theme = useTheme();
    return (
        <Icon
            icon={faComment}
            onHoverText={props.onHoverText}
            color={props.color ?? theme.accentBackgroundColor}
            popper={props.popper}
        />
    );
};

export default SpeechBubbleIcon;
