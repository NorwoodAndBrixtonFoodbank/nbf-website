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
    if (totalMonths <= 12) {
        return `${totalMonths} month old`;
    } else if (totalMonths > 12 && totalMonths < 24) {
        return `${years} year old`;
    } else {
        return `${years - 1} to ${years} year old`;
    }
};

export const getAdultAgeUsingBirthYear = (birthYear: number): string => {
    const years = getCurrentYear() - birthYear;
    return `${years} year old`;
};
