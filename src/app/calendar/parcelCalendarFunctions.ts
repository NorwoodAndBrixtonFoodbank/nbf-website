import { Schema } from "@/database_utils";
import { CalendarEvent } from "@/components/Calendar/Calendar";

type ClientName = { clients: { full_name: string } | null };
type CollectionCentres = { collection_centres: { name: string } | null };

export type ParcelsWithExtraFields = Schema["parcels"] & ClientName & CollectionCentres;

const COLLECTION_DURATION_MS = 30 * 60 * 1000;

export interface LocationColorMap {
    [location: string]: { color: string; text: string };
}

export const getParcelsWithCollectionDate = async (): Promise<ParcelWithClientName[]> => {
    const { data, error } = await supabase
        .from("parcels")
        .select("*, clients ( full_name )")
        .not("collection_datetime", "is", null);
    if (error) {
        throw new Error("We were unable to fetch the parcels data. Please try again later");
    }
    return data;
};

export const parcelsToCollectionEvents = (
    parcels: ParcelsWithExtraFields[],
    colorMap: LocationColorMap
): CalendarEvent[] => {
    return parcels.map((parcel) => {
        const fullName = parcel.clients?.full_name ?? "";

        const collectionStart = new Date(parcel.collection_datetime!);
        const collectionEnd = new Date(collectionStart.getTime() + COLLECTION_DURATION_MS);

        const location = parcel.collection_centres!.name ?? "";

        const eventColor = colorMap[location] ?? colorMap.default;

        const event: CalendarEvent = {
            id: parcel.primary_key,
            title: `${fullName} [${location}]`,
            start: collectionStart,
            end: collectionEnd,
            backgroundColor: eventColor.color,
            borderColor: eventColor.color,
            textColor: eventColor.text,
            location: location,
        };
        return event;
    });
};
