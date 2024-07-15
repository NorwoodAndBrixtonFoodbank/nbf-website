const formatTimestamp = (timestamp: number): string => {
    if (isNaN(timestamp)) {
        return "-";
    }

    return new Date(timestamp).toLocaleString("en-gb");
};

export const userTableColumnDisplayFunctions = {
    createdAt: (createdAt: number | null) => {
        return createdAt === null ? "-" : formatTimestamp(createdAt);
    },
    updatedAt: (updatedAt: number | null) => {
        return updatedAt === null ? "-" : formatTimestamp(updatedAt);
    },
    lastSignInAt: (lastSignInAt: number | null) => {
        return lastSignInAt === null ? "-" : formatTimestamp(lastSignInAt);
    },
};
