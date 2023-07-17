"use client";

import React, { JSXElementConstructor, ReactElement } from "react";
import { styled } from "styled-components";

const BackDrop = styled.div`
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.foregroundColor};
    height: 100%;
    width: 100%;
    padding: 2rem;
`;

export default function ({
    children,
}: {
    children: ReactElement<any, string | JSXElementConstructor<any>>;
}) {
    return <BackDrop>{children}</BackDrop>;
}
