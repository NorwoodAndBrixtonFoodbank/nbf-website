import { Json } from "@/databaseTypesFile";
import { Dayjs } from "dayjs";

export const nullPostcodeDisplay = "NFA";

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

export const formatBoolean = (boolean: boolean): string => (boolean ? "True" : "False");

export const formatJson = (json: Json): string => JSON.stringify(json);

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
