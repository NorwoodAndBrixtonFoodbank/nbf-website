"use client";

import React from "react";
import styled from "styled-components";

interface Props {
    children: string;
}

const TitleHeader = styled.h1`
    text-align: center;
    margin: 1em;
    font-size: min(6.5vw, 2rem);
`;

const Title: React.FC<Props> = (props) => {
    return <TitleHeader>{props.children}</TitleHeader>;
};

export default Title;
