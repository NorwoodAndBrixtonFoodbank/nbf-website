"use client";

import React from "react";
import styled from "styled-components";

interface TitleProps {
    children: string;
}

const TitleHeader = styled.h1`
    text-align: center;
    margin: 1em;

    @media only screen and (max-width: 480px) {
        font-size: 25px;
    }
    @media only screen and (max-width: 380px) {
        font-size: 20px;
    }
`;

const Title: React.FC<TitleProps> = (props) => {
    return <TitleHeader>{props.children}</TitleHeader>;
};

export default Title;
