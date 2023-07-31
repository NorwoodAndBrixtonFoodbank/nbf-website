"use client";

import { Metadata } from "next";
import React, { useRef } from "react";
import ParcelCalendar from "@/app/calendar/ParcelCalendar";
import getParcelCalendarEvents from "@/app/calendar/getParcelCalendarEvents";
import PdfButton from "../../components/PdfSaver/somepdf";

const CalendarPage = async (): Promise<React.ReactElement> => {
    const pdfRef = useRef();
    const events = await getParcelCalendarEvents();

    return (
        <main>
            <div ref={pdfRef}>
                <ParcelCalendar events={events} />
            </div>
            <PdfButton pdfRef={pdfRef} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default CalendarPage;
