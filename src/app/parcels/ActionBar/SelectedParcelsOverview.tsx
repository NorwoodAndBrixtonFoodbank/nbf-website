import styled from "styled-components";
import React from "react";
import dayjs from "dayjs";
import { nullPostcodeDisplay } from "../../../common/format";
import { ParcelsTableRow } from "../parcelsTable/types";

const Heading = styled.div`
    font-size: 1.2rem;
    margin: 0.3rem;
`;

const ListItem = styled.p<{ emphasised?: boolean }>`
    margin-left: 1rem;
    padding: 0.5rem 0;
    ${(props) =>
        props.emphasised &&
        `
            font-weight: 800;
        `}
`;

interface ShowParcelsProps {
    parcels: ParcelsTableRow[];
    maxParcelsToShow: number;
}

const SelectedParcelsOverview: React.FC<ShowParcelsProps> = (props) => {
    return (
        <>
            <Heading>{props.parcels.length === 1 ? "Parcel" : "Parcels"} selected:</Heading>
            {props.parcels.slice(0, props.maxParcelsToShow).map((parcel) => (
                <ListItem key={parcel.parcelId}>
                    {parcel.addressPostcode ?? nullPostcodeDisplay}
                    {parcel.fullName && ` - ${parcel.fullName}`}
                    {parcel.collectionDatetime &&
                        ` @ ${dayjs(parcel.collectionDatetime!).format("DD/MM/YYYY HH:mm")}`}
                </ListItem>
            ))}
            {props.parcels.length > props.maxParcelsToShow && <ListItem emphasised>...</ListItem>}
        </>
    );
};

export default SelectedParcelsOverview;
