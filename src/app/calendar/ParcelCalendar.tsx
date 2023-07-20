"use client";

import supabase, { Schema } from "@/supabase";
import Calendar, { CalendarEvent } from "@/components/Calendar/Calendar";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";

interface ClientMap {
    [primary_key: string]: Schema["clients"];
}

const Centerer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SizedAspectRatio = styled.div`
    width: 100vmin;
    margin: 2em;
`;

const fetchClient: () => Promise<Schema["clients"][]> = async () => {
    const response = await supabase.from("clients").select();
    return response.data ?? [];
};

const fetchParcel: () => Promise<Schema["parcels"][]> = async () => {
    const response = await supabase.from("parcels").select();
    return response.data ?? [];
};

const clientsToClientMap = (clients: Schema["clients"][]): ClientMap => {
    const clientMap: ClientMap = {};

    clients.forEach((client: Schema["clients"]) => {
        clientMap[client.primary_key] = client;
    });

    return clientMap;
};

const getParcelsWithCollectionDate = (parcels: Schema["parcels"][]): Schema["parcels"][] => {
    return parcels.filter((parcel) => parcel.collection_datetime !== null);
};

const parcelsToCollectionEvents = (
    parcels: Schema["parcels"][],
    clientMap: ClientMap
): CalendarEvent[] => {
    return parcels.map((parcel) => {
        const fullName = clientMap[parcel.client_id].full_name;
        const location = parcel.collection_centre !== null ? `[${parcel.collection_centre}]` : "";

        const collectionStart = new Date(parcel.collection_datetime!);
        const collectionEnd = new Date(collectionStart.getTime() + COLLECTION_DURATION);

        const event: CalendarEvent = {
            id: parcel.primary_key,
            title: `${fullName} ${location}`,
            start: collectionStart,
            end: collectionEnd,
            backgroundColor: colorMap[parcel.collection_centre ?? ""] ?? colorMap.default,
        };
        return event;
    });
};

const MINUTES = 60 * 1000;
const COLLECTION_DURATION = 30 * MINUTES;

const colorMap: { [location: string]: string } = {
    "Cambridge Office": "red",
    "London Office": "green",
    default: "light blue",
};

const ParcelCalendar: React.FC<{}> = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        const getEvents = async (): Promise<CalendarEvent[]> => {
            const clients: Schema["clients"][] = await fetchClient();
            const parcels: Schema["parcels"][] = await fetchParcel();

            const clientMap: ClientMap = clientsToClientMap(clients);
            const parcelsWithCollectionDate = getParcelsWithCollectionDate(parcels);

            return parcelsToCollectionEvents(parcelsWithCollectionDate, clientMap);
        };

        getEvents().then((events) => {
            setEvents(events);
        });
    }, []);

    return (
        <>
            <Centerer>
                <SizedAspectRatio>
                    <Calendar initialEvents={events} editable={false} />
                </SizedAspectRatio>
            </Centerer>
        </>
    );
};

export default ParcelCalendar;
