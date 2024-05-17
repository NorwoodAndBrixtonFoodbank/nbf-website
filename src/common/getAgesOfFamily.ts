import { youngestAdultBirthYear } from "@/app/clients/form/birthYearDropdown";
import { getCurrentMonth, getCurrentYear } from "@/common/date";

export const isChildUsingBirthYear = (birthYear: number): boolean => {
    return getCurrentYear() - birthYear <= 16;
};

export const getChildAgeUsingBirthYearAndMonth = (
    birthYear: number,
    birthMonth: number | null,
    shortHand: boolean
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
    }
    if (shortHand) {
        return `${years}`;
    }
    return totalMonths < 24 ? `${years}-year-old` : `${years}-years-old`;
};

export const getAdultAgeUsingBirthYear = (birthYear: number): string => {
    const years = getCurrentYear() - birthYear;
    return `${years}-years-old`;
};

export const isAdult = (birthYear: number): boolean => {
    return birthYear <= parseInt(youngestAdultBirthYear());
};

export const isBaby = (birthYear: number): boolean => {
    return birthYear >= getCurrentYear() - 2;
};
