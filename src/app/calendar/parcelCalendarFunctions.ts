import { Schema } from "@/database_utils";
import { CalendarEvent } from "@/components/Calendar/Calendar";

export type ParcelWithClientName = Schema["parcels"] & { clients: { full_name: string } | null };

export type ParcelsWithExtraFields = ParcelWithClientName & {
    collection_centres: { name: string } | null;
};

const COLLECTION_DURATION_MS = 30 * 60 * 1000;

export interface LocationColorMap {
    [location: string]: { color: string; text: string };
}

export const parcelsToCollectionEvents = (
    parcels: ParcelsWithExtraFields[],
    colorMap: LocationColorMap
): CalendarEvent[] => {
    return parcels.map((parcel) => {
        const fullName = parcel.clients?.full_name ?? "";

        const collectionStart = new Date(parcel.collection_datetime!);
        const collectionEnd = new Date(collectionStart.getTime() + COLLECTION_DURATION_MS);

        const collectionCentre = parcel.collection_centres!.name ?? "default";
        const location = collectionCentre !== "default" ? `${collectionCentre}` : "";

        const eventColor = colorMap[collectionCentre] ?? colorMap.default;

        const event: CalendarEvent = {
            id: parcel.primary_key,
            title: `${fullName} [${location}]`,
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
