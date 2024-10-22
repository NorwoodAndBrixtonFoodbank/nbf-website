import { youngestAdultBirthYear } from "@/app/clients/form/birthYearDropdown";
import { getCurrentMonth, getCurrentYear } from "@/common/date";
import { Schema } from "@/databaseUtils";

// If a Person does not have a birth year then they're assumed to be an adult

export const isChildUsingBirthYear = (birthYear: number | null): boolean => {
    return birthYear ? getCurrentYear() - birthYear <= 16 : false;
};

export const getChildAgeStringUsingBirthYearAndMonth = (
    birthYear: number | null,
    birthMonth: number | null,
    shortHand: boolean
): string => {
    if (birthYear === null) {
        return "unknown age";
    }

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

export const getAdultAgeStringUsingBirthYear = (
    birthYear: number | null,
    shortHand: boolean
): string => {
    if (birthYear === null) {
        return "unknown age";
    }

    const years = getCurrentYear() - birthYear;
    return shortHand ? `${years}y` : `${years}-years-old`;
};

export const isAdultUsingBirthYear = (birthYear: number | null): boolean => {
    return birthYear ? birthYear <= parseInt(youngestAdultBirthYear()) : true;
};

export const isBaby = (birthYear: number | null): boolean => {
    return birthYear ? birthYear >= getCurrentYear() - 2 : false;
};

export const isChildPerson = (person: Schema["families"]): boolean => {
    return isChildUsingBirthYear(person.birth_year);
};

export const isAdultPerson = (person: Schema["families"]): boolean => {
    return isAdultUsingBirthYear(person.birth_year);
};
