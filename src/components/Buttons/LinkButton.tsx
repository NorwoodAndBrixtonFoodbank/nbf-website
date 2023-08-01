import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Button from "@mui/material/Button";

const UnstyledLink = styled(Link)`
    text-decoration: none;
    display: contents;
`;

const LinkButton: React.FC<{ href: string }> = (props) => {
    return (
        <UnstyledLink href={props.href}>
            <Button></Button>
        </UnstyledLink>
    );
};

export default LinkButton;
