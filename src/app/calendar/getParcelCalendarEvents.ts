import supabase, { Schema } from "@/supabase";
import { CalendarEvent } from "@/components/Calendar/Calendar";

const COLLECTION_DURATION_MS = 30 * 60 * 1000;

const colorMap: { [location: string]: string } = {
    "Brixton Hill - Methodist Church": "#d50300",
    "Clapham - St Stephens Church": "#f4511e",
    "N&B - Emmanuel Church": "#f6bf25",
    "Streatham - Immanuel & St Andrew": "#33b679",
    "Vauxhall Hope Church": "#0a8043",
    "Waterloo - Oasis": "#039be5",
    "Waterloo - St George the Martyr": "#3f51b5",
    "Waterloo - St Johns": "#7986cb",
    Delivery: "#8e24aa",
    default: "#626161",
};

interface ClientMap {
    [primary_key: string]: Schema["clients"];
}

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

    clients.forEach((client) => {
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
    if (Object.keys(clientMap).length === 0) {
        return [];
    }

    return parcels.map((parcel) => {
        const fullName = clientMap[parcel.client_id].full_name;
        const location = parcel.collection_centre !== null ? `[${parcel.collection_centre}]` : "";

        const collectionStart = new Date(parcel.collection_datetime!);
        const collectionEnd = new Date(collectionStart.getTime() + COLLECTION_DURATION_MS);

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

const getParcelCalendarEvents = async (): Promise<CalendarEvent[]> => {
    const clients: Schema["clients"][] = await fetchClient();
    const parcels: Schema["parcels"][] = await fetchParcel();

    const clientMap: ClientMap = clientsToClientMap(clients);
    const parcelsWithCollectionDate = getParcelsWithCollectionDate(parcels);

    return parcelsToCollectionEvents(parcelsWithCollectionDate, clientMap);
};

export default getParcelCalendarEvents;
