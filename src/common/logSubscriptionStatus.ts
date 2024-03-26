import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";

export const logSubscriptionStatus = async (
    status: "TIMED_OUT" | "CHANNEL_ERROR" | "CLOSED" | "SUBSCRIBED",
    err: Error | undefined,
    tableName: string
): Promise<boolean> => {
    if (status === "TIMED_OUT") {
        await logErrorReturnLogId(`Channel Timed Out: Subscribe to ${tableName} table`, err);
        return true;
    } else if (status === "CHANNEL_ERROR") {
        await logErrorReturnLogId(`Channel Error: Subscribe to ${tableName} table`, err);
        return true;
    } else if (status === "CLOSED") {
        logInfoReturnLogId(`Subscription to ${tableName} table closed`);
    } else {
        logInfoReturnLogId(`Subscribed to ${tableName} table`);
    }
    return false;
};
