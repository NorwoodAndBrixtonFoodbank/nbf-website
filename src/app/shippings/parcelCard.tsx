"use client";

import React from "react";
import styled from "styled-components";

export interface ParcelClients {
    primary_key: string;
    packing_datetime: string;
    collection_centre: string;
    collection_datetime: string;
    voucher_number: string;
    full_name?: string;
    phone_number?: string;
    address_1?: string;
    address_2?: string;
    address_town?: string;
    address_county?: string;
    address_postcode?: string;
    delivery_instructions?: string;
}

interface ParcelCardProps {
    parcel: ParcelClients;
    index: number;
    total: number;
}

const CardWrapper = styled.div`
    border-style: solid;
    margin: 0.5rem;
    background: ${(props) => props.theme.surfaceBackgroundColor};
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`;

const GridItem = styled.div`
    margin: 0.4rem;
    position: relative;
`;

const GridMiddle = styled(GridContainer)`
    min-height: 110px;
`;

const GridRight = styled(GridItem)`
    text-align: right;
`;

const Bottom = styled.div`
    position: absolute;
    bottom: 0;
`
const BottomRight = styled(Bottom)`
    right: 0;
`

const DeliveryText = styled.p`
    font-weight: bold;
`;

const VoucherText = styled.p`
    font-weight: bold;
    font-size: 1.3rem;
`;

export const ParcelCard: React.FC<ParcelCardProps> = ({ parcel, index, total }) => {
    return (
        <CardWrapper>
            <GridContainer>
                <GridItem>
                    <b>NAME:</b> {parcel.full_name}
                </GridItem>
                <GridItem>
                    <b>CONTACT:</b> {parcel.phone_number}
                </GridItem>
                <GridRight>
                    <b>PACKED:</b> {parcel.packing_datetime}
                </GridRight>
            </GridContainer>
            <GridMiddle>
                <GridItem>
                    <p>{parcel.address_1}</p>
                    <p>{parcel.address_2}</p>
                    <p>{parcel.address_town}</p>
                    <p>{parcel.address_county}</p>
                    <p>{parcel.address_postcode}</p>
                </GridItem>
                <GridItem>
                    <DeliveryText>Delivery Instructions:</DeliveryText>
                    <p>{parcel.delivery_instructions}</p>
                </GridItem>
            </GridMiddle>
            <GridContainer>
                <GridItem>
                    <VoucherText>{parcel.voucher_number}</VoucherText>
                </GridItem>
                <GridItem>
                    <Bottom>{parcel.collection_datetime} | {parcel.collection_centre}</Bottom>
                </GridItem>
                <GridRight>
                    <BottomRight>Parcel {index} / {total}</BottomRight>
                </GridRight>
            </GridContainer>
        </CardWrapper>
    );
};
