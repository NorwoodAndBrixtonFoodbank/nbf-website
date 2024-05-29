export const getCurrentYear = (): number => {
    const currentDate = new Date();
    return currentDate.getFullYear();
};

export const getCurrentMonth = (): number => {
    const currentDate = new Date();
    return currentDate.getMonth() + 1;
};
