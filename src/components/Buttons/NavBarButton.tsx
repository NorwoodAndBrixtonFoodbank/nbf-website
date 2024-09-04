"use client";

import React from "react";
import Button from "@mui/material/Button";
import { usePathname } from "next/navigation";
import { UnstyledLink } from "@/components/Buttons/GeneralButtonParts";
import styled from "styled-components";

interface Props {
    link: string;
    page: string;
    onClick?: () => void;
}

const NavBarStyledButton = styled(Button)`
    padding: 0.2rem 0.6rem;
    white-space: nowrap;
`;

const NavBarButton: React.FC<Props> = (props) => {
    const pathname = usePathname();

    const active = pathname.startsWith(props.link);

    return (
        <UnstyledLink key={props.page} href={props.link}>
            <NavBarStyledButton
                color="primary"
                variant={active ? "contained" : "outlined"}
            >
                {props.page}
            </NavBarStyledButton>
        </UnstyledLink>
    );
};

export default NavBarButton;
