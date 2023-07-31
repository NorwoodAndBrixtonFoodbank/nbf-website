"use client";

import { DatabaseAutoType } from "@/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import React from "react";
import styled, { useTheme } from "styled-components";

const MiddleDiv = styled.div`
    max-width: 400px;
    box-shadow: 0px 0px 15px ${(props) => props.theme.shadow};
    border-radius: 10px;
    padding: 50px;
    margin: auto;
    background-color: ${(props) => props.theme.main.background[0]};

    --fonts-buttonFontFamily: "Inter-Regular", san-serif;
    --fonts-bodyFontFamily: "Inter-Regular", san-serif;
    --fonts-inputFontFamily: "Inter-Regular", san-serif;
    --fonts-labelFontFamily: "Inter-Bold", san-serif;

    & input {
        border-color: ${(props) => props.theme.main.background[0]};
        background-color: ${(props) => props.theme.main.background[1]};
    }

    & input:-webkit-autofill,
    & input:-webkit-autofill:hover,
    & input:-webkit-autofill:focus,
    & input:-webkit-autofill:active {
        transition: background-color 99999s ease-in-out 0s;
        -webkit-text-fill-color: ${(props) => props.theme.main.foreground[1]} !important;
    }

    & button {
        border: transparent;
    }
`;

const LoginPanel: React.FC<{}> = () => {
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
                                inputLabelText: theme.main.foreground[1],
                                anchorTextColor: theme.main.foreground[3],
                                defaultButtonBackground: theme.primary.background[1],
                                brand: theme.primary.background[2],
                                brandButtonText: theme.primary.foreground[2],
                                inputText: theme.main.foreground[1],
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
