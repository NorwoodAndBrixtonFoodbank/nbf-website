import supabase, { Schema } from "@/supabase";
import { CalendarEvent } from "@/components/Calendar/Calendar";

const COLLECTION_DURATION_MS = 30 * 60 * 1000;

interface LocationColorMap {
    [location: string]: string;
}

// TODO VFB-16 Consider adding a rainbow palette for a selection of accessible colours (something like these but they don't need to be matched exactly)
const colorMap: LocationColorMap = {
    "Brixton Hill - Methodist Church": "#FA9189",
    "Clapham - St Stephens Church": "#FCAE7C",
    "N&B - Emmanuel Church": "#FFD868",
    "Streatham - Immanuel & St Andrew": "#B3F5BC",
    "Vauxhall Hope Church": "#66B79B",
    "Waterloo - Oasis": "#A0C7DB",
    "Waterloo - St George the Martyr": "#96B9FF",
    "Waterloo - St Johns": "#CEAAE9",
    Delivery: "#A7A1FF",
    default: "#D2C9BC",
};

// TODO VFB-16 Add a font colour that is accessible with the colours within the map above
const eventTextColor = "#000000";

interface ClientMap {
    [primary_key: string]: Schema["clients"];
}

const getClientMap = async (): Promise<ClientMap> => {
    const response = await supabase.from("clients").select();
    const clients = response.data ?? [];
    const clientMap: ClientMap = {};

    clients.forEach((client) => {
        clientMap[client.primary_key] = client;
    });

    return clientMap;
};

const getParcelsWithCollectionDate = async (): Promise<Schema["parcels"][]> => {
    const response = await supabase.from("parcels").select().not("collection_datetime", "is", null);
    return response.data ?? [];
};

const parcelsToCollectionEvents = (
    parcels: Schema["parcels"][],
    clientMap: ClientMap
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
            backgroundColor: eventColor,
            borderColor: eventColor,
            textColor: eventTextColor,
        };
        return event;
    });
};

const getParcelCalendarEvents = async (): Promise<CalendarEvent[]> => {
    const clientMap: ClientMap = await getClientMap();
    const parcelsWithCollectionDate = await getParcelsWithCollectionDate();

    return parcelsToCollectionEvents(parcelsWithCollectionDate, clientMap);
};

export default getParcelCalendarEvents;
