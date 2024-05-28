import { Json } from "@/databaseTypesFile";
import dayjs, { Dayjs } from "dayjs";

export const displayPostcodeForHomelessClient = "NFA";

export const displayNameForDeletedClient = "Deleted Client";

export const formatCamelCaseKey = (objectKey: string): string => {
    const withSpace = objectKey.replaceAll(/([a-z])([A-Z])/g, "$1 $2");
    return withSpace.toUpperCase();
};

export const displayList = (data: string[]): string => {
    return data.length === 0 ? "None" : data.join(", ");
};

export const formatDateToDate = (dateString: string | null): string => {
    if (dateString === null) {
        return "";
    }
    return new Date(dateString).toLocaleString("en-GB", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
};

export const formatDatetimeAsDate = (datetime: Date | string | null): string => {
    if (datetime instanceof Date) {
        return datetime.toLocaleDateString("en-GB");
    }

    if (datetime === null || isNaN(Date.parse(datetime))) {
        return "-";
    }

    return new Date(datetime).toLocaleDateString("en-GB");
};

export const formatDateTime = (datetime: Date | string | null): string => {
    if (datetime instanceof Date) {
        return datetime.toLocaleString("en-GB");
    }

    if (datetime === null || isNaN(Date.parse(datetime))) {
        return "-";
    }

    return new Date(datetime).toLocaleString("en-GB");
};

export const getDbDate = (dateTime: Dayjs): string => dateTime.format("YYYY-MM-DD");

export const formatBooleanOrNull = (booleanOrNull: boolean | null): string =>
    booleanOrNull === null ? "" : booleanOrNull ? "True" : "False";

export const getEventDataDate = (dateTime: Dayjs): string => dateTime.format("DD/MM/YYYY");

export const formatJson = (json: Json): string => JSON.stringify(json, null, 2);

export const capitaliseWords = (words: string): string =>
    words
        .split(" ")
        .map((word) => (word === "a" ? word : `${word[0].toUpperCase()}${word.slice(1)}`))
        .join(" ");

export const getReadableWebsiteDataName = (name: string): string =>
    name
        .split("_")
        .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join(" ");

export const getParcelOverviewString = (
    addressPostcode: string | null,
    fullName: string | null,
    collectionDatetime: Date | null,
    clientIsActive: boolean
): string => {
    if (clientIsActive) {
        return (
            (addressPostcode ?? displayPostcodeForHomelessClient) +
            (fullName && ` - ${fullName}`) +
            (collectionDatetime && ` @ ${dayjs(collectionDatetime).format("DD/MM/YYYY HH:mm")}`)
        );
    }
    return (
        displayNameForDeletedClient +
        (collectionDatetime && ` @ ${dayjs(collectionDatetime).format("DD/MM/YYYY HH:mm")}`)
    );
};
