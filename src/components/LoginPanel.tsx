"use client";

import { DatabaseAutoType } from "@/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import React from "react";
import styled, { useTheme } from "styled-components";

const MiddleDiv = styled.div`
    max-width: 400px;
    box-shadow: 0 0 15px ${(props) => props.theme.shadow};
    border-radius: 10px;
    padding: 50px;
    margin: auto;
    background-color: ${(props) => props.theme.main.background[0]};

    --fonts-buttonFontFamily: Helvetica, Arial, sans-serif;
    --fonts-bodyFontFamily: Helvetica, Arial, sans-serif;
    --fonts-inputFontFamily: Helvetica, Arial, sans-serif;
    --fonts-labelFontFamily: Helvetica, Arial, sans-serif;

    & input {
        border-color: ${(props) => props.theme.main.background[0]};
        background-color: ${(props) => props.theme.main.background[1]};
    }

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

    & button {
        border: transparent;
    }
`;

const LoginPanel: React.FC = () => {
    const supabase = createClientComponentClient<DatabaseAutoType>();
    const theme = useTheme();

    return (
        <MiddleDiv>
            <Auth
                supabaseClient={supabase}
                providers={[]}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                inputLabelText: theme.main.foreground[2],
                                anchorTextColor: theme.main.lighterForeground,
                                defaultButtonBackground: theme.primary.background[1],
                                brand: theme.primary.background[2],
                                brandButtonText: theme.primary.foreground[2],
                                inputText: theme.main.foreground[2],
                                defaultButtonBackgroundHover: theme.primary.background[2],
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
