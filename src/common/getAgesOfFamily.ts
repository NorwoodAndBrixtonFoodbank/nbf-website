import { youngestAdultBirthYear } from "@/app/clients/form/birthYearDropdown";
import { getCurrentMonth, getCurrentYear } from "@/common/date";
import { Schema } from "@/databaseUtils";

export const isChildUsingBirthYear = (birthYear: number): boolean => {
    return getCurrentYear() - birthYear < 16;
};

export const getChildAgeUsingBirthYearAndMonth = (
    birthYear: number,
    birthMonth: number | null,
    shortHand: boolean
): string => {
    const years = getCurrentYear() - birthYear;
    const months = birthMonth ? getCurrentMonth() - birthMonth : 0;
    const totalMonths = years * 12 + months;

    if (totalMonths <= 1) {
        return shortHand ? `${totalMonths}m` : `${totalMonths}-month-old`;
    }
    if (totalMonths < 12) {
        return shortHand ? `${totalMonths}m` : `${totalMonths}-months-old`;
    }
    if (shortHand) {
        return `${years}y`;
    }
    return totalMonths < 24 ? `${years}-year-old` : `${years}-years-old`;
};

export const getAdultAgeUsingBirthYear = (birthYear: number, shortHand: boolean): string => {
    const years = getCurrentYear() - birthYear;
    return shortHand ? `${years}y` : `${years}-years-old`;
};

export const isAdultUsingBirthYear = (birthYear: number): boolean => {
    return birthYear <= parseInt(youngestAdultBirthYear());
};

export const isBaby = (birthYear: number): boolean => {
    return birthYear >= getCurrentYear() - 2;
};

export const isChildPerson = (person: Schema["families"]): boolean => {
    return isChildUsingBirthYear(person.birth_year);
};

export const isAdultPerson = (person: Schema["families"]): boolean => {
    return isAdultUsingBirthYear(person.birth_year);
};
