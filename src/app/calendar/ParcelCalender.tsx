"use client";

import supabase, { Schema } from "@/supabase";
import Calendar, { CalendarEvent } from "@/components/Calendar/Calendar";
import React from "react";
import { styled } from "styled-components";

interface ParcelReformatted {
    collection_centre: string | null;
    collection_datetime: Date;
    client_id: string;
    packing_datetime: Date;
    primary_key: string;
}

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
    height: 100vmin;
`;

const fetchClient: () => Promise<Schema["clients"][]> = async () => {
    const response = await supabase.from("clients").select();
    return response.data ?? [];
};

const fetchParcel: () => Promise<Schema["parcels"][]> = async () => {
    const response = await supabase.from("parcels").select();
    return response.data ?? [];
};

const parcelsToParcelsReformatted = (parcels: Schema["parcels"][]): ParcelReformatted[] => {
    const parcelsWithoutNullDate = parcels.filter(
        (parcel) => parcel.collection_datetime !== null && parcel.packing_datetime !== null
    );

    const parcelsReformatted = parcelsWithoutNullDate.map((parcel) => {
        const parcelReformatted: ParcelReformatted = {
            collection_centre: parcel.collection_centre,
            collection_datetime: new Date(parcel.collection_datetime!),
            client_id: parcel.client_id,
            packing_datetime: new Date(parcel.collection_datetime!),
            primary_key: parcel.primary_key,
        };
        return parcelReformatted;
    });

    return parcelsReformatted;
};

const parcelsReformattedToEvents = (
    parcelsReformatted: ParcelReformatted[],
    clientMap: ClientMap
): CalendarEvent[] => {
    const events = parcelsReformatted.map((parcelReformatted) => {
        const fullName = clientMap[parcelReformatted.client_id].full_name;
        const location =
            parcelReformatted.collection_centre !== null
                ? `[${parcelReformatted.collection_centre}]`
                : "";
        const event: CalendarEvent = {
            id: parcelReformatted.primary_key,
            title: `${fullName} ${location}`,
            start: parcelReformatted.packing_datetime,
            end: parcelReformatted.collection_datetime,
        };
        return event;
    });
    return events;
};

const clientsToClientMap = (clients: Schema["clients"][]): ClientMap => {
    const clientMap: ClientMap = {};
    clients.forEach((client: Schema["clients"]) => {
        clientMap[client.primary_key] = client;
    });
    return clientMap;
};

const ParcelCalendar: () => Promise<React.ReactElement> = async () => {
    const clients: Schema["clients"][] = await fetchClient();
    const parcels: Schema["parcels"][] = await fetchParcel();

    const clientMap: ClientMap = clientsToClientMap(clients);
    const parcelsReformatted: ParcelReformatted[] = parcelsToParcelsReformatted(parcels);
    const events: CalendarEvent[] = parcelsReformattedToEvents(parcelsReformatted, clientMap);

    return (
        <>
            <Centerer>
                <SizedAspectRatio>
                    <Calendar initialEvents={events} editable={true} />
                </SizedAspectRatio>
            </Centerer>
            {/* <pre>{JSON.stringify(parcelsReformatted, null, 4)}</pre>
            <pre>{JSON.stringify(clients, null, 4)}</pre> */}
        </>
    );
};

export default ParcelCalendar;
