export const getCurrentYear = (): number => {
    const currentDate = new Date();
    return currentDate.getFullYear();
};

export const isChildUsingBirthYear = (birthYear: number): boolean => {
    return getCurrentYear() - birthYear <= 15;
};
