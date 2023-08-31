export const formatCamelCaseKey = (objectKey: string): string => {
    const withSpace = objectKey.replaceAll(/([a-z])([A-Z])/g, "$1 $2");
    return withSpace.toUpperCase();
};

export const displayList = (data: string[]): string => {
    return data.length === 0 ? "None" : data.join(", ");
};
