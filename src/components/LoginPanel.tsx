"use client";

import { DatabaseAutoType } from "@/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";
import Title from "@/components/Title/Title";
import { NavBarHeight } from "@/components/NavBar/NavigationBar";
import Paper from "@mui/material/Paper";

export const LoginMain = styled.main`
    height: calc(100vh - ${NavBarHeight});
    display: flex;
    align-content: center;
`;

const MiddleDiv = styled(Paper)`
    max-width: 400px;
    border-radius: 10px;
    padding: 10px 10px;
    margin: auto 10%;
    background-color: ${(props) => props.theme.main.background[0]};

    --fonts-buttonFontFamily: Helvetica, Arial, sans-serif;
    --fonts-bodyFontFamily: Helvetica, Arial, sans-serif;
    --fonts-inputFontFamily: Helvetica, Arial, sans-serif;
    --fonts-labelFontFamily: Helvetica, Arial, sans-serif;
    //

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

    & button:hover {
        color: ${(props) => props.theme.main.background[2]};
    }

    @media (min-width: 375px) {
        padding: 25px 25px;
        margin: auto;
    }

    @media (min-width: 525px) {
        padding: 30px 80px;
        margin: auto;
    }
`;

const LoginPanel: React.FC<{}> = () => {
    const supabase = createClientComponentClient<DatabaseAutoType>();
    const theme = useTheme();

    const [loaded, setLoaded] = React.useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <MiddleDiv data-loaded={loaded} id="login-panel">
            <Title>Login</Title>
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
                redirectTo="http://localhost:3000/auth/callback"
            />
        </MiddleDiv>
    );
};

export default LoginPanel;
