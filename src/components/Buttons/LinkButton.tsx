"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { usePathname } from "next/navigation";

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
    const pathname = usePathname();
    const active = pathname.startsWith(props.link);
    return (
        <UnstyledLink key={props.page} href={props.link} prefetch={false}>
            <Button color="primary" variant={active ? "contained" : "outlined"}>
                {props.page}
            </Button>
        </UnstyledLink>
    );
};

export default LinkButton;
