import { StatusType } from "./ActionBar/Statuses";

export const formatEventName = (newStatus: StatusType, eventData: string | null): string => {
    if (newStatus === "Out for Delivery") {
        return newStatus + (eventData ? ` ${eventData}` : "");
    }
    return newStatus + (eventData ? ` (${eventData})` : "");
};
