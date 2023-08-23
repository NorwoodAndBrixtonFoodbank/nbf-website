import { CalendarEvent } from "@/components/Calendar/Calendar";
import { ParcelWithClientName } from "@/app/calendar/getParcelsWithCollectionDate";

export interface LocationColorMap {
    [location: string]: { color: string; text: string };
}

const COLLECTION_DURATION_MS = 30 * 60 * 1000;

const parcelsToCollectionEvents = (
    parcels: ParcelWithClientName[],
    colorMap: LocationColorMap
): CalendarEvent[] => {
    return parcels.map((parcel) => {
        const fullName = parcel.clients?.full_name ?? "";

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

export default parcelsToCollectionEvents;
