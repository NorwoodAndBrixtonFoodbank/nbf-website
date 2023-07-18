"use client";

import { ThemeUpdateContext } from "@/app/themes";
import Button from "@/components/Buttons/Button";
import ButtonPost from "@/components/Buttons/ButtonPost";
import React, { useContext } from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    background-color: ${(props) => props.theme.primaryBackgroundColor};
    color: ${(props) => props.theme.primaryForegroundColor};
    height: 10%;
    align-items: flex-end;
    padding: 0;
    gap: 10px;
`;

const Divider = styled.div`
    width: 100%;
    height: 5px;
    background-color: ${(props) => props.theme.secondaryBackgroundColor};
    color: ${(props) => props.theme.secondaryForegroundColor};
`;

const Logo = styled.img`
    height: 100%;
`;

const Gap = styled.div`
    flex-grow: 1;
`;

const NavBar: React.FC<{}> = () => {
    const setTheme = useContext(ThemeUpdateContext);

    return (
        <header>
            <Container>
                <Logo alt="Vauxhall Foodbank Logo" src="/logo.png" />

                <Button href="/clients"> Clients</Button>

                <Button href="/lists"> Lists </Button>

                <Button href="/calendar">Calendar</Button>
                <Gap />

                <ButtonPost text="Sign out" url="/auth/signout" />
                <button
                    type="button"
                    className="light-button"
                    onClick={() => {
                        setTheme(false); // enable light theme
                    }}
                >
                    Light
                </button>
                <button
                    type="button"
                    className="dark-button"
                    onClick={() => {
                        setTheme(true); // enable dark theme
                    }}
                >
                    Dark
                </button>
            </Container>
            <Divider />
        </header>
    );
};

export default NavBar;
