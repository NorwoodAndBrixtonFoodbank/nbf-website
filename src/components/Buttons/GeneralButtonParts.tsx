"use client";

import styled from "styled-components";
import Link from "next/link";

export const UnstyledLink = styled(Link)`
    text-decoration: none;
    display: contents;
`;

export const ButtonWrap = styled.div`
    margin: 1rem;
`;

export const ConfirmButtons = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: stretch;
`;
