"use client";

import Calendar from "@/components/Calendar/Calendar";
import Title from "@/components/Title/Title";
import React from "react";
import styled, { RainbowPalette, useTheme } from "styled-components";
import {
    LocationColorMap,
    ParcelWithClientName,
} from "@/app/calendar/getParcelsWithCollectionDate";
import parcelsToCollectionEvents from "@/app/calendar/parcelsToCollectionEvents";

interface ParcelCalendarProps {
    parcelsWithCollectionDate: ParcelWithClientName[];
}

interface ColorTextProps {
    color: string;
    text: string;
}

const Centerer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CalendarWrapper = styled.div`
    width: min(100vw, 1200px);
    margin: 0 2em 2em;
`;

const ParcelCalendar: React.FC<ParcelCalendarProps> = (props) => {
    const chosenTheme = useTheme();

    const getColorText = (color: keyof RainbowPalette): ColorTextProps => {
        return {
            color: `${chosenTheme.rainbow[color].background}`,
            text: `${chosenTheme.rainbow[color].foreground}`,
        };
    };

    const colorMap: LocationColorMap = {
        "Brixton Hill - Methodist Church": getColorText("lightRed"),
        "Clapham - St Stephens Church": getColorText("lightOrange"),
        "N&B - Emmanuel Church": getColorText("lightYellow"),
        "Streatham - Immanuel & St Andrew": getColorText("lightGreen"),
        "Vauxhall Hope Church": getColorText("darkGreen"),
        "Waterloo - Oasis": getColorText("lightBlue"),
        "Waterloo - St George the Martyr": getColorText("darkBlue"),
        "Waterloo - St Johns": getColorText("lightPurple"),
        Delivery: getColorText("darkPurple"),
        default: getColorText("lightBrown"),
    };
    return (
        <>
            <Title>Collection Time for Parcels</Title>
            <Centerer>
                <CalendarWrapper>
                    <Calendar
                        initialEvents={parcelsToCollectionEvents(
                            props.parcelsWithCollectionDate,
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
