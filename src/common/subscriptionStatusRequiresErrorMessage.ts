import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";

export const subscriptionStatusRequiresErrorMessage = (
    status: "TIMED_OUT" | "CHANNEL_ERROR" | "CLOSED" | "SUBSCRIBED",
    err: Error | undefined,
    tableName: string
): boolean => {
    switch (status) {
        case "TIMED_OUT":
            void logErrorReturnLogId(`Channel Timed Out: Subscribe to ${tableName} table`, {}, err);
            return true;
        case "CHANNEL_ERROR":
            void logErrorReturnLogId(`Channel Error: Subscribe to ${tableName} table`, {}, err);
            return true;
        case "CLOSED":
            void logInfoReturnLogId(`Subscription to ${tableName} table closed`);
            return false;
        case "SUBSCRIBED":
            void logInfoReturnLogId(`Subscribed to ${tableName} table`);
            return false;
    }
};
