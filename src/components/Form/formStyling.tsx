"use client";

import styled from "styled-components";
import { Paper } from "@mui/material";

export const CenterComponent = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    margin-bottom: 1rem;
`;

export const StyledForm = styled.form`
    padding: 2em;
    max-width: 1500px;
    display: flex;
    gap: 1em;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

export const StyledCard = styled(Paper)`
    display: flex;
    flex-direction: column;
    padding: 2em;
    width: 100%;
    height: 80%;
    border-radius: 10px;
    background-color: ${(props) => props.theme.main.background[0]};
    color: ${(props) => props.theme.main.foreground[0]};

    & > div {
        width: 100%;
        margin: 0.15em 0;
    }
`;

export const ErrorText = styled.p`
    color: ${(props) => props.theme.error};
    font-size: 0.75rem;
    margin: 3px 14px 0 14px;
`;

export const FormText = styled.p`
    padding-bottom: 1em;
`;

export const FormSubheading = styled.h2`
    padding-bottom: 1em;
`;

export const FormErrorText = styled(FormText)`
    color: ${(props) => props.theme.error};
    margin-bottom: 3em;
    text-align: center;
`;

export const GappedDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
`;
