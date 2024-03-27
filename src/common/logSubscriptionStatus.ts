import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";

export const checkAndLogSubscriptionStatus = (
    status: "TIMED_OUT" | "CHANNEL_ERROR" | "CLOSED" | "SUBSCRIBED",
    err: Error | undefined,
    tableName: string
): boolean => {
    if (status === "TIMED_OUT") {
        void logErrorReturnLogId(`Channel Timed Out: Subscribe to ${tableName} table`, err);
        return false;
    } else if (status === "CHANNEL_ERROR") {
        void logErrorReturnLogId(`Channel Error: Subscribe to ${tableName} table`, err);
        return false;
    } else if (status === "CLOSED") {
        void logInfoReturnLogId(`Subscription to ${tableName} table closed`);
    } else {
        void logInfoReturnLogId(`Subscribed to ${tableName} table`);
    }
    return true;
};
