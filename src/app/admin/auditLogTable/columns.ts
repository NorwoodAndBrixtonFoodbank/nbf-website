import { TableHeaders } from "@/components/Tables/Table";
import { AuditLogRow } from "./types";

export const auditLogTableHeaderKeysAndLabels: TableHeaders<AuditLogRow> = [
    ["action", "Action"],
    ["createdAt", "Time"],
    ["actorProfileId", "Actor Profile ID"],
    ["content", "Content"],
    ["wasSuccess", "Success"],
    ["logId", "Log ID"],
    ["parcelId", "Parcel ID"],
    ["clientId", "Client ID"],
    ["eventId", "Event ID"],
    ["listId", "List ID"],
    ["collectionCentreId", "Collection Centre ID"],
    ["profileId", "Profile ID"],
    ["packingSlotId", "Packing Slot ID"],
    ["listHotelId", "List Hotel ID"],
    ["statusOrder", "Status Order"],
    ["websiteData", "Website Data"],
];
