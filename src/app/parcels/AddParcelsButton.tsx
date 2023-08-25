"use client";

import React from "react";
import styled from "styled-components";
import PopUpButton from "@/components/Buttons/PopUpButton";
import LinkButton from "@/components/Buttons/LinkButton";

const PopUp = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 2rem;
`;

const AddParcelsButton: React.FC<{}> = () => {
    return (
        <PopUpButton displayText="Add Parcel">
            <PopUp>
                <LinkButton link="/clients/add">New Client</LinkButton>
                <LinkButton link="/clients/">Existing Client</LinkButton>
            </PopUp>
        </PopUpButton>
    );
};

export default AddParcelsButton;
