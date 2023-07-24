"use client";

import React from "react";
import { styled } from "styled-components";

interface TitleProps {
    children: string;
}

const TitleDiv = styled.h1`
    text-align: center;
    margin-top: 1em;
`;

const Title: React.FC<TitleProps> = (props) => {
    return <TitleDiv>{props.children}</TitleDiv>;
};

export default Title;
