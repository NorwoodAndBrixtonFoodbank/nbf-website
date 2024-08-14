import React from "react";
import styled, { DefaultTheme, useTheme } from "styled-components";
import Title from "@/components/Title/Title";
import { NavBarHeight } from "@/components/NavigationBar/NavigationBar";
import Paper from "@mui/material/Paper";
import { Button, TextField } from "@mui/material";
import Link from "next/link";

export const AuthMain = styled.main`
    height: calc(100vh - ${NavBarHeight} * 2);
    display: flex;
    align-content: center;
    justify-content: center;
`;

const MiddleDiv = styled(Paper)`
    flex-grow: 1;
    max-width: 450px;
    border-radius: 10px;
    padding: 2.5rem clamp(20px, 3vw, 50px);
    margin: auto 20px;
    background-color: ${(props) => props.theme.main.background[0]};

    --fonts-buttonFontFamily: Helvetica, Arial, sans-serif;
    --fonts-bodyFontFamily: Helvetica, Arial, sans-serif;
    --fonts-inputFontFamily: Helvetica, Arial, sans-serif;
    --fonts-labelFontFamily: Helvetica, Arial, sans-serif;

    // Google Chrome password autofill will automatically make the background blue and the word black, which is inconsistent with our current theme
    // The below forces the background on Google Chrome to be our desired background
    // Since Google Chrome used !important in their -webkit-autofill, we cannot override their background-color setting
    & input:-webkit-autofill,
    & input:-webkit-autofill:hover,
    & input:-webkit-autofill:focus,
    & input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 9999px ${(props) => props.theme.main.background[2]} inset !important;
        -webkit-text-fill-color: ${(props) => props.theme.main.foreground[2]} !important;
    }

    & * {
        transition: none;
    }

    & button:hover {
        color: ${(props) => props.theme.primary.foreground[2]};
    }
`;

const AuthInputSection = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const AuthLinkElement = styled(Link)<{ theme: DefaultTheme }>`
    color: ${(props) => props.theme.main.lighterForeground[0]};
    font-size: 13px;
    text-align: center;
`;

const ErrorMessage = styled.span<{ theme: DefaultTheme }>`
    color: ${(props) => props.theme.error};
    font-size: 13px;
    text-align: center;
    white-space: pre-line;
`;

const SuccessMessage = styled.span<{ theme: DefaultTheme }>`
    color: ${(props) => props.theme.main.foreground[0]};
    font-size: 13px;
    text-align: center;
`;

interface AuthPanelProps {
    title: string;
    emailField: AuthTextField | null;
    passwordField: AuthTextField | null;
    submitText: string;
    onSubmit: () => void;
    authLinks?: AuthLink[];
    errorMessage: string | null;
    successMessage: string | null;
}

interface AuthTextField {
    text: string;
    setText: (newText: string) => void;
}

export interface AuthLink {
    label: string;
    href: string;
}

const AuthPanel: React.FC<AuthPanelProps> = ({
    title,
    emailField,
    passwordField,
    submitText,
    onSubmit,
    authLinks,
    errorMessage,
    successMessage,
}) => {
    const theme = useTheme();

    return (
        <MiddleDiv elevation={5} id="login-panel">
            <Title>{title}</Title>
            <AuthInputSection>
                {emailField && (
                    <TextField
                        id="email"
                        label="Email address"
                        variant="outlined"
                        type="email"
                        value={emailField.text}
                        onChange={(event) => emailField.setText(event.target.value)}
                    />
                )}

                {passwordField && (
                    <TextField
                        id="password"
                        type="password"
                        label="Your Password"
                        variant="outlined"
                        value={passwordField.text}
                        onChange={(event) => passwordField.setText(event.target.value)}
                    />
                )}

                <Button variant="contained" type="submit" onClick={onSubmit}>
                    {submitText}
                </Button>

                {authLinks &&
                    authLinks.map((authLink) => (
                        <AuthLinkElement key={authLink.label} href={authLink.href} theme={theme}>
                            {authLink.label}
                        </AuthLinkElement>
                    ))}

                {errorMessage && <ErrorMessage theme={theme}>{errorMessage}</ErrorMessage>}

                {successMessage && <SuccessMessage theme={theme}>{successMessage}</SuccessMessage>}
            </AuthInputSection>
        </MiddleDiv>
    );
};

export default AuthPanel;
