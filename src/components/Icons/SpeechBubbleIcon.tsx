"use client";

import React from "react";
import Icon from "@/components/Icons/Icon";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { styled } from "styled-components";

interface Props {
    onHoverText?: string;
    color?: string;
    popper?: boolean;
}

const ColouredIcon = styled(Icon)`
    color: ${(props) => props.color ?? props.theme.accentBackgroundColor};
`;

const SpeechBubbleIcon: React.FC<Props> = (props) => {
    return <ColouredIcon icon={faComment} onHoverText={props.onHoverText} popper={props.popper} />;
};

export default SpeechBubbleIcon;
