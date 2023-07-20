"use client";

import React from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

interface Props {
    icon: IconDefinition;
    color?: string;
    onHoverText?: string;
}

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
    width: 1em;
    height: 1em;
    margin: 0.125em;
    color: ${(props) => props.color ?? props.theme.accentBackgroundColor};
`;

const Popper = styled.div`
    position: absolute;
    background-color: ${(props) => props.theme.primaryBackgroundColor};
    color: ${(props) => props.theme.primaryForegroundColor};
    padding: 0.5em;
    border-radius: 0.5em;
    z-index: 10;
    font-size: 0.7em;

    transform: translateY(2em);

    box-shadow: 0 0 0.2rem ${(props) => props.theme.disabledColor};
`;

const Icon: React.FC<Props> = (props) => {
    const [hovered, setHovered] = React.useState(false);

    const show = (): void => {
        setHovered(true);
    };

    const hide = (): void => {
        setHovered(false);
    };

    return (
        <>
            {props.onHoverText && hovered ? (
                <Popper
                    onMouseEnter={show}
                    onMouseLeave={hide}
                    onMouseDown={show}
                    onMouseUp={hide}
                    onTouchStart={show}
                    onTouchEnd={hide}
                >
                    {props.onHoverText}
                </Popper>
            ) : (
                <></>
            )}
            <StyledFontAwesomeIcon
                icon={props.icon}
                color={props.color}
                aria-label={props.onHoverText}
                onMouseEnter={show}
                onMouseLeave={hide}
                onMouseDown={show}
                onMouseUp={hide}
                onTouchStart={show}
                onTouchEnd={hide}
            />
        </>
    );
};

export default Icon;
