import { formatTimestampAsDatetimeInUserTimezone } from "@/common/format";

export const userTableColumnDisplayFunctions = {
    createdAt: (createdAt: number | null) => {
        return createdAt === null ? "-" : formatTimestampAsDatetimeInUserTimezone(createdAt);
    },
    updatedAt: (updatedAt: number | null) => {
        return updatedAt === null ? "-" : formatTimestampAsDatetimeInUserTimezone(updatedAt);
    },
    lastSignInAt: (lastSignInAt: number | null) => {
        return lastSignInAt === null ? "-" : formatTimestampAsDatetimeInUserTimezone(lastSignInAt);
    },
};
