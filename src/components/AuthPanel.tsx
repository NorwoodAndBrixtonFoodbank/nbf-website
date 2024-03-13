import React from "react";
import styled, { useTheme } from "styled-components";
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

interface AuthPanelProps {
    title: string;
    emailField: AuthTextField | null;
    passwordField: AuthTextField | null;
    submitText: string;
    onSubmit: (() => void) | (() => Promise<void>);
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

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {emailField && (
                    <TextField
                        id="email"
                        label="Email address"
                        variant="outlined"
                        value={emailField.text}
                        onChange={(event) => emailField.setText(event.target.value)}
                    />
                )}

                {passwordField && (
                    <TextField
                        id="password"
                        label="Your Password"
                        variant="outlined"
                        value={passwordField.text}
                        onChange={(event) => passwordField.setText(event.target.value)}
                    />
                )}

                <Button variant="contained" onClick={onSubmit}>
                    {submitText}
                </Button>

                {authLinks &&
                    authLinks.map((authLink) => (
                        <Link
                            key={authLink.label}
                            href={authLink.href}
                            style={{
                                color: theme.main.lighterForeground[0],
                                fontSize: "13px",
                                textAlign: "center",
                            }}
                        >
                            {authLink.label}
                        </Link>
                    ))}

                {errorMessage && (
                    <span style={{ color: theme.error, fontSize: "13px", textAlign: "center" }}>
                        {errorMessage}
                    </span>
                )}

                {successMessage && (
                    <span
                        style={{
                            color: theme.main.foreground[0],
                            fontSize: "13px",
                            textAlign: "center",
                        }}
                    >
                        {successMessage}
                    </span>
                )}
            </div>
        </MiddleDiv>
    );
};

export default AuthPanel;
