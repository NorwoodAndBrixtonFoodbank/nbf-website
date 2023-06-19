"use client";

import Button from "@/components/Buttons/Button";
import ButtonPost from "@/components/Buttons/ButtonPost";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    background-color: ${(props) => props.theme.backgroundColor};
    height: 10%;
    align-items: flex-end;
    padding: 0;
    gap: 10px;
`;

const Divider = styled.div`
    width: 100%;
    height: 5px;
    background-color: ${(props) => props.theme.fillColor};
`;

const Logo = styled.img`
    height: 100%;
`;

const Gap = styled.div`
    flex-grow: 1;
`;

const NavBar: React.FC<{}> = () => {
    return (
        <>
            <Container>
                <Logo alt="Vauxhall Foodbank Logo" src="/logo.png" />

                <Button href="/clients"> Clients</Button>

                <Button href="/lists"> Lists </Button>

                <Button href="/calendar">Calendar</Button>

                <Gap />

                <ButtonPost text="Sign out" url="/auth/signout" />
            </Container>
            <Divider />
        </>
    );
};

export default NavBar;
