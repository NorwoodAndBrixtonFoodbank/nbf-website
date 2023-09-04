import { Schema } from "@/databaseUtils";
import { CalendarEvent } from "@/components/Calendar/Calendar";
import { RainbowPalette } from "styled-components";

type Clients = {
    clients: { full_name: Schema["clients"]["full_name"] } | null;
};

type CollectionCentres = {
    collection_centres: { name: Schema["collection_centres"]["name"] } | null;
};

export type ParcelsWithExtraFields = Schema["parcels"] & Clients & CollectionCentres;

const COLLECTION_DURATION_MS = 30 * 60 * 1000;

export interface LocationColorMap {
    [location: Schema["collection_centres"]["name"] | "default"]: {
        color: RainbowPalette[keyof RainbowPalette]["background"];
        text: RainbowPalette[keyof RainbowPalette]["foreground"];
    };
}

export const parcelsToCollectionEvents = (
    parcels: ParcelsWithExtraFields[],
    colorMap: LocationColorMap
): CalendarEvent[] => {
    return parcels.map((parcel) => {
        const fullName = parcel.clients!.full_name ?? "";

        const collectionStart = new Date(parcel.collection_datetime!);
        const collectionEnd = new Date(collectionStart.getTime() + COLLECTION_DURATION_MS);

        const collectionCentre = parcel.collection_centres!.name ?? "default";
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
            location: collectionCentre,
        };
        return event;
    });
};
