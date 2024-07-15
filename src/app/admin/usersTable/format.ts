import { formatTimestampAsDatetime } from "@/common/format";

export const userTableColumnDisplayFunctions = {
    createdAt: (createdAt: number | null) => {
        return createdAt === null ? "-" : formatTimestampAsDatetime(createdAt);
    },
    updatedAt: (updatedAt: number | null) => {
        return updatedAt === null ? "-" : formatTimestampAsDatetime(updatedAt);
    },
    lastSignInAt: (lastSignInAt: number | null) => {
        return lastSignInAt === null ? "-" : formatTimestampAsDatetime(lastSignInAt);
    },
};
