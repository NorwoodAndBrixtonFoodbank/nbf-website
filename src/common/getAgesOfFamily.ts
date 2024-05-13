export const getCurrentYear = (): number => {
    const currentDate = new Date();
    return currentDate.getFullYear();
};
export const getCurrentMonth = (): number => {
    const currentDate = new Date();
    return currentDate.getMonth() + 1;
};

export const isChildUsingBirthYear = (birthYear: number): boolean => {
    return getCurrentYear() - birthYear <= 16;
};

export const getChildAgeUsingBirthYearAndMonth = (
    birthYear: number,
    shortHand: boolean,
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
    if (totalMonths <= 1) {
        if (shortHand) {
            return `${totalMonths}m`;
        }
        return `${totalMonths}-month-old`;
    }
    if (totalMonths <= 12) {
        if (shortHand) {
            return `${totalMonths}m`;
        }
        return `${totalMonths}-months-old`;
    } else {
        if (shortHand) {
            return `${years}`;
        }
        return totalMonths < 24 ? `${years}-year-old` : `${years}-years-old`;
    }
};

export const getAdultAgeUsingBirthYear = (birthYear: number): string => {
    const years = getCurrentYear() - birthYear;
    return `${years}-years-old`;
};
