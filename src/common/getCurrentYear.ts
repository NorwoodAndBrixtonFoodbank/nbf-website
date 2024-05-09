export const getCurrentYear = (): number => {
    const currentDate = new Date();
    return currentDate.getFullYear();
};
export const getCurrentMonth = (): number => {
    const currentDate = new Date();
    return currentDate.getMonth() + 1;
};

export const isChildUsingBirthYear = (birthYear: number): boolean => {
    return getCurrentYear() - birthYear <= 15;
};

export const getChildAgeUsingBirthYearAndMonth = (
    birthYear: number,
    birthMonth?: number
): string => {
    const years = getCurrentYear() - birthYear;
    let totalMonths;
    if (birthMonth) {
        const months = getCurrentMonth() - birthMonth;
        totalMonths = years * 12 + months;
    } else {
        totalMonths = years * 12;
    }
    if (totalMonths <= 24) {
        return `${totalMonths} month old`;
    } else if (totalMonths > 24 && totalMonths < 36) {
        return `${years} year old`;
    } else {
        return `${years - 1} to ${years} year old`;
    }
};
