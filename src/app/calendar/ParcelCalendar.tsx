"use client";

import Calendar from "@/components/Calendar/Calendar";
import Title from "@/components/Title/Title";
import React from "react";
import styled, { useTheme } from "styled-components";
import {
    ClientMap,
    LocationColorMap,
    parcelsToCollectionEvents,
} from "@/app/calendar/parcelCalendarFunctions";
import { Schema } from "@/supabase";
interface ParcelCalendarProps {
    clientMap: ClientMap;
    parcelsWithCollectionDate: Schema["parcels"][];
}

const Centerer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CalendarWrapper = styled.div`
    width: 100vmin;
    margin: 0 2em 2em;
`;

const ParcelCalendar: React.FC<ParcelCalendarProps> = (props) => {
    const chosenTheme = useTheme();

    const colorMap: LocationColorMap = {
        "Brixton Hill - Methodist Church": {
            color: `${chosenTheme.rainbow.lightRed.background}`,
            text: `${chosenTheme.rainbow.lightRed.foreground}`,
        },
        "Clapham - St Stephens Church": {
            color: `${chosenTheme.rainbow.lightOrange.background}`,
            text: `${chosenTheme.rainbow.lightOrange.foreground}`,
        },
        "N&B - Emmanuel Church": {
            color: `${chosenTheme.rainbow.lightYellow.background}`,
            text: `${chosenTheme.rainbow.lightYellow.foreground}`,
        },
        "Streatham - Immanuel & St Andrew": {
            color: `${chosenTheme.rainbow.lightGreen.background}`,
            text: `${chosenTheme.rainbow.lightGreen.foreground}`,
        },
        "Vauxhall Hope Church": {
            color: `${chosenTheme.rainbow.darkGreen.background}`,
            text: `${chosenTheme.rainbow.darkGreen.foreground}`,
        },
        "Waterloo - Oasis": {
            color: `${chosenTheme.rainbow.lightBlue.background}`,
            text: `${chosenTheme.rainbow.lightBlue.foreground}`,
        },
        "Waterloo - St George the Martyr": {
            color: `${chosenTheme.rainbow.darkBlue.background}`,
            text: `${chosenTheme.rainbow.darkBlue.foreground}`,
        },
        "Waterloo - St Johns": {
            color: `${chosenTheme.rainbow.lightPurple.background}`,
            text: `${chosenTheme.rainbow.lightPurple.foreground}`,
        },
        Delivery: {
            color: `${chosenTheme.rainbow.darkPurple.background}`,
            text: `${chosenTheme.rainbow.darkPurple.foreground}`,
        },
        default: {
            color: `${chosenTheme.rainbow.lightBrown.background}`,
            text: `${chosenTheme.rainbow.lightBrown.foreground}`,
        },
    };
    return (
        <>
            <Title>Collection Time for Parcels</Title>
            <Centerer>
                <CalendarWrapper>
                    <Calendar
                        initialEvents={parcelsToCollectionEvents(
                            props.parcelsWithCollectionDate,
                            props.clientMap,
                            colorMap
                        )}
                        editable={false}
                    />
                </CalendarWrapper>
            </Centerer>
        </>
    );
};

export default ParcelCalendar;
