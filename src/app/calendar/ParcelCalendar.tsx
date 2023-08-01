"use client";

import Calendar, { CalendarEvent } from "@/components/Calendar/Calendar";
import Title from "@/components/Title/Title";
import React from "react";
import styled from "styled-components";

const Centerer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CalendarWrapper = styled.div`
    width: 100vmin;
    margin: 2em;
`;

interface ParcelCalendarProps {
    events: CalendarEvent[];
}

const ParcelCalendar: React.FC<ParcelCalendarProps> = (props) => {
    return (
        <>
            <Title>Collection Time for Parcels</Title>
            <Centerer>
                <CalendarWrapper>
                    <Calendar initialEvents={props.events} editable={false} />
                </CalendarWrapper>
            </Centerer>
        </>
    );
};

export default ParcelCalendar;