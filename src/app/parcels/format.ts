import { StatusType } from "./ActionBar/Statuses";

export const formatEventName = (newStatus: StatusType, eventData: string | null): string =>
    `${newStatus} ${eventData ? ` (${eventData})` : ""}`;
