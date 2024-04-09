import { Dayjs } from "dayjs";

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

export const getDbDate = (dateTime: Dayjs): string => dateTime.format("YYYY-MM-DD");
