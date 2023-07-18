"use client";

import supabase, { Schema } from "@/supabase";
import Calendar, { CalendarEvent } from "@/components/Calendar/Calendar";
import { Metadata } from "next";
import React from "react";
import { styled } from "styled-components";

interface ParcelReformatted {
    collection_centre: string;
    collection_datetime: Date;
    client_id: string;
    packing_datetime: Date;
    primary_key: string;
}

const Centerer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SizedAspectRatio = styled.div`
    width: 100vmin;
    height: 100vmin;
`;

const dataFetch: () => Promise<Schema["parcels"][]> = async () => {
    const response = await supabase.from("parcels").select();
    return response.data ?? [];
};

// const dataFetchFamily: () => Promise<Schema["families"][]> = async () => {
//     const response = await supabase.from("families").select();
//     return response.data ?? [];
// };

// const dataFetchList: () => Promise<Schema["lists"][]> = async () => {
//     const response = await supabase.from("lists").select();
//     return response.data ?? [];
// };

const parcelToParcelReformatted = (parcels: Schema["parcels"][]): ParcelReformatted[] => {
    const parcelsWithoutNullDate = parcels.filter(
        (parcel) => parcel.collection_datetime !== null && parcel.packing_datetime !== null
    );

    const parcelsReformatted = parcelsWithoutNullDate.map((parcel) => {
        const parcelReformatted: ParcelReformatted = {
            collection_centre: parcel.collection_centre ?? "",
            collection_datetime: new Date(parcel.collection_datetime!),
            client_id: parcel.client_id,
            packing_datetime: new Date(parcel.collection_datetime!),
            primary_key: parcel.primary_key,
        };
        return parcelReformatted;
    });

    return parcelsReformatted;
};

const parcelFormattedToEvent = (parcelsReformatted: ParcelReformatted[]): CalendarEvent[] => {
    const events = parcelsReformatted.map((parcelReformatted) => {
        const event: CalendarEvent = {
            id: parcelReformatted.primary_key,
            title: `Parcels for ${parcelReformatted.client_id}`,
            start: parcelReformatted.packing_datetime,
            end: parcelReformatted.collection_datetime,
            description:
                parcelReformatted.collection_centre !== ""
                    ? `Collect at ${parcelReformatted.collection_centre}`
                    : undefined,
        };
        return event;
    });
    return events;
};

const CalendarPage: () => Promise<React.ReactElement> = async () => {
    const parcelsReformatted: ParcelReformatted[] = parcelToParcelReformatted(await dataFetch());
    // const families: Schema["families"][] = await dataFetchFamily();
    // const lists: Schema["lists"][] = await dataFetchList();

    return (
        <main>
            <h1> Calendar Page </h1>

            <Centerer>
                <SizedAspectRatio>
                    <Calendar
                        initialEvents={parcelFormattedToEvent(parcelsReformatted)}
                        editable={true}
                    />
                </SizedAspectRatio>
            </Centerer>

            <pre>{JSON.stringify(parcelsReformatted, null, 4)}</pre>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Calendar",
};

export default CalendarPage;
