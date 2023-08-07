"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Button from "@mui/material/Button";

const UnstyledLink = styled(Link)`
    text-decoration: none;
    display: contents;
`;

type LinkButtonProps = {
    link: string;
    page: string;
    onClick?: () => void;
};
const LinkButton: React.FC<LinkButtonProps> = (props) => {
    return (
        <UnstyledLink key={props.page} href={props.link} prefetch={false}>
            <Button color="secondary">{props.page}</Button>
        </UnstyledLink>
    );
};

export default LinkButton;
