import supabase, { Schema } from "@/supabase";
import { CalendarEvent } from "@/components/Calendar/Calendar";

const COLLECTION_DURATION_MS = 30 * 60 * 1000;

export interface LocationColorMap {
    [location: string]: { color: string; text: string };
}

export interface ClientMap {
    [primary_key: string]: Schema["clients"];
}

export const getClientMap = async (): Promise<ClientMap> => {
    const response = await supabase.from("clients").select();
    const clients = response.data ?? [];
    const clientMap: ClientMap = {};

    clients.forEach((client) => {
        clientMap[client.primary_key] = client;
    });

    return clientMap;
};

export const getParcelsWithCollectionDate = async (): Promise<Schema["parcels"][]> => {
    const response = await supabase.from("parcels").select().not("collection_datetime", "is", null);
    return response.data ?? [];
};

export const parcelsToCollectionEvents = (
    parcels: Schema["parcels"][],
    clientMap: ClientMap,
    colorMap: LocationColorMap
): CalendarEvent[] => {
    if (Object.keys(clientMap).length === 0) {
        return [];
    }

    return parcels.map((parcel) => {
        const fullName = clientMap[parcel.client_id].full_name;

        const collectionStart = new Date(parcel.collection_datetime!);
        const collectionEnd = new Date(collectionStart.getTime() + COLLECTION_DURATION_MS);

        const collectionCentre = parcel.collection_centre ?? "default";
        const location = collectionCentre !== "default" ? `[${collectionCentre}]` : "";

        const eventColor = colorMap[collectionCentre] ?? colorMap.default;

        const event: CalendarEvent = {
            id: parcel.primary_key,
            title: `${fullName} ${location}`,
            start: collectionStart,
            end: collectionEnd,
            backgroundColor: eventColor.color,
            borderColor: eventColor.color,
            textColor: eventColor.text,
        };
        return event;
    });
};
