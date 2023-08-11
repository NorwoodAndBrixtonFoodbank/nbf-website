"use client";

import React from "react";
import styled from "styled-components";

interface TitleProps {
    children: string;
}

const TitleHeader = styled.h1`
    text-align: center;
    margin: 1em;
    font-size: min(6.5vw, 2rem);
`;

const Title: React.FC<TitleProps> = (props) => {
    return <TitleHeader>{props.children}</TitleHeader>;
};

export default Title;
