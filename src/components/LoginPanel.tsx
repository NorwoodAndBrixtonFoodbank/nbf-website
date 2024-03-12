"use client";

import { DatabaseAutoType } from "@/databaseUtils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import React, { useEffect, useState } from "react";
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

const LoginPanel: React.FC<{}> = () => {
    const supabase = createClientComponentClient<DatabaseAutoType>();
    const theme = useTheme();

    const [loaded, setLoaded] = useState(false);
    const [baseUrl, setBaseUrl] = useState<string | null>(null);

    useEffect(() => {
        setBaseUrl(window.location.origin);
        setLoaded(true);
    }, []);

    return (
        <MiddleDiv elevation={5} data-loaded={loaded} id="login-panel">
            <Title>Login</Title>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <TextField id="email" label="Email address" variant="outlined" />
                <TextField id="password" label="Your Password" variant="outlined" />
                <Button variant="contained">Sign in</Button>
                <Link
                    href="/forgot-password"
                    style={{
                        color: theme.main.lighterForeground[0],
                        fontSize: "13px",
                        textAlign: "center",
                    }}
                >
                    Forgot your password?
                </Link>
            </div>
            <Auth
                supabaseClient={supabase}
                providers={[]}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                inputText: theme.main.foreground[3],
                                inputBackground: theme.main.background[3],
                                inputBorder: theme.main.background[3],
                                inputLabelText: theme.main.foreground[0],
                                anchorTextColor: theme.main.lighterForeground[0],
                                brand: theme.primary.background[3],
                                brandAccent: theme.primary.background[2],
                                brandButtonText: theme.primary.foreground[3],
                                messageTextDanger: theme.error,
                            },
                        },
                    },
                }}
                redirectTo={`${baseUrl}/auth/callback`}
            />
        </MiddleDiv>
    );
};

export default LoginPanel;
