"use client";

import styled from "styled-components";
import Link from "next/link";

export const UnstyledLink = styled(Link)`
    text-decoration: none;
    display: contents;
`;

export const ConfirmButtons = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: stretch;
    display: flex;
    justify-content: center;
    margin: 1rem;
`;
