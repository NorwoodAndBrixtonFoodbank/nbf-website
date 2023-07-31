"use client";

import Calendar from "@/components/Calendar/Calendar";
import Title from "@/components/Title/Title";
import React, { useContext } from "react";
import styled from "styled-components";
import {
    ClientMap,
    LocationColorMap,
    parcelsToCollectionEvents,
} from "@/app/calendar/parcelCalendarFunctions";
import { Schema } from "@/supabase";
import { ChosenThemeContext } from "@/app/themes";

interface ParcelCalendarProps {
    // events: CalendarEvent[];
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
    const chosenTheme = useContext(ChosenThemeContext);

    const colorMap: LocationColorMap = {
        "Brixton Hill - Methodist Church": {
            color: `${chosenTheme.rainbow.color.red[0]}`,
            text: `${chosenTheme.rainbow.foreground.red[0]}`,
        },
        "Clapham - St Stephens Church": {
            color: `${chosenTheme.rainbow.color.orange[0]}`,
            text: `${chosenTheme.rainbow.foreground.orange[0]}`,
        },
        "N&B - Emmanuel Church": {
            color: `${chosenTheme.rainbow.color.yellow[0]}`,
            text: `${chosenTheme.rainbow.foreground.yellow[0]}`,
        },
        "Streatham - Immanuel & St Andrew": {
            color: `${chosenTheme.rainbow.color.lightGreen[0]}`,
            text: `${chosenTheme.rainbow.foreground.lightGreen[0]}`,
        },
        "Vauxhall Hope Church": {
            color: `${chosenTheme.rainbow.color.darkGreen[0]}`,
            text: `${chosenTheme.rainbow.foreground.darkGreen[0]}`,
        },
        "Waterloo - Oasis": {
            color: `${chosenTheme.rainbow.color.blue[0]}`,
            text: `${chosenTheme.rainbow.foreground.blue[0]}`,
        },
        "Waterloo - St George the Martyr": {
            color: `${chosenTheme.rainbow.color.blue[1]}`,
            text: `${chosenTheme.rainbow.foreground.blue[1]}`,
        },
        "Waterloo - St Johns": {
            color: `${chosenTheme.rainbow.color.purple[0]}`,
            text: `${chosenTheme.rainbow.foreground.purple[0]}`,
        },
        Delivery: {
            color: `${chosenTheme.rainbow.color.purple[1]}`,
            text: `${chosenTheme.rainbow.foreground.purple[1]}`,
        },
        default: {
            color: `${chosenTheme.rainbow.color.brown[0]}`,
            text: `${chosenTheme.rainbow.foreground.brown[0]}`,
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
