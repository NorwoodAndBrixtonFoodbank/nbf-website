"use client";

import Calendar from "@/components/Calendar/Calendar";
import Title from "@/components/Title/Title";
import React from "react";
import styled, { RainbowPalette, useTheme } from "styled-components";

import {
    LocationColorMap,
    parcelsToCollectionEvents,
    ParcelsWithExtraFields,
} from "@/app/calendar/parcelCalendarFunctions";
import { Centerer } from "@/components/Modal/ModalFormStyles";

interface ParcelCalendarProps {
    parcelsWithCollectionDate: ParcelsWithExtraFields[];
    collectionCentres: string[];
}

interface ColorTextProps {
    color: string;
    text: string;
}

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

    const colorArray: (keyof RainbowPalette)[] = [
        "lightBrown",
        "lightRed",
        "lightPurple",
        "lightOrange",
        "lightBlue",
        "lightYellow",
        "lightGreen",
        "darkGreen",
        "darkBlue",
        "darkPurple",
        "darkBrown",
        "darkYellow",
        "darkOrange",
        "darkRed",
    ];

    const colorMap: LocationColorMap = [...props.collectionCentres, "default"].reduce(
        (prevColorMap, currentCollectionCentre, currentIndex) => ({
            ...prevColorMap,
            [currentCollectionCentre]: getColorText(colorArray[currentIndex % colorArray.length]),
        }),
        {} as LocationColorMap
    );

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
                        allLocations={props.collectionCentres}
                    />
                </CalendarWrapper>
            </Centerer>
        </>
    );
};

export default ParcelCalendar;
