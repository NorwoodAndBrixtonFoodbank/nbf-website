"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Button from "@mui/material/Button";

const UnstyledLink = styled(Link)`
    text-decoration: none;
    display: contents;
`;

const UpperCaseButton = styled(Button)`
    text-transform: uppercase;
`;

type LinkButtonProps = {
    link: string;
    page: string;
    onClick?: () => void;
};
const LinkButton: React.FC<LinkButtonProps> = (props) => {
    return (
        <UnstyledLink key={props.page} href={props.link} prefetch={false}>
            <UpperCaseButton color="secondary">{props.page}</UpperCaseButton>
        </UnstyledLink>
    );
};

export default LinkButton;
