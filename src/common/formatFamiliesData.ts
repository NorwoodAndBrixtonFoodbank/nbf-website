import { Person } from "@/components/Form/formFunctions";
import { Schema } from "@/databaseUtils";
import { displayList } from "@/common/format";
import {
    getChildAgeUsingBirthYearAndMonth,
    getCurrentYear,
    isChildUsingBirthYear,
} from "@/common/getAgesOfFamily";

export interface HouseholdSummary {
    householdSize: string;
    genderBreakdown: string;
    ageAndGenderOfAdults: string;
    numberOfBabies: string;
    ageAndGenderOfChildren: string;
}

const getChild = (child: Person): string => {
    let gender;
    switch (child.gender) {
        case "male":
            gender = "M";
            break;
        case "female":
            gender = "F";
            break;
        case "other":
            gender = "-";
            break;
    }
    let age;
    if (child.birthMonth) {
        age = getChildAgeUsingBirthYearAndMonth(child.birthYear, true, child.birthMonth);
    } else {
        age = getChildAgeUsingBirthYearAndMonth(child.birthYear, true);
    }

    return `${age} ${gender}`;
};

const getAdult = (adult: Person): string => {
    let gender;
    switch (adult.gender) {
        case "male":
            gender = "M";
            break;
        case "female":
            gender = "F";
            break;
        case "other":
            gender = "-";
            break;
    }
    const age = getCurrentYear() - adult.birthYear;
    return `${age} ${gender}`;
};

const convertPlural = (value: number, description: string): string => {
    return `${value} ${description}${value !== 1 ? "s" : ""}`;
};

export const prepareHouseholdSummary = (familyData: Schema["families"][]): HouseholdSummary => {
    const children = familyData.filter((member) => isChildUsingBirthYear(member.birth_year));
    const formattedChildren: Person[] = children.map((child) => {
        return {
            gender: child.gender,
            birthMonth: child.birth_month,
            birthYear: child.birth_year,
        };
    });
    const adults = familyData.filter((member) => !isChildUsingBirthYear(member.birth_year));
    const formattedAdults: Person[] = adults.map((adult) => {
        return {
            gender: adult.gender,
            birthYear: adult.birth_year,
        };
    });
    const householdSize = familyData.length;
    const numberBabies = familyData.filter(
        (member) => member.birth_year === getCurrentYear()
    ).length;
    const numberFemales = familyData.filter((member) => member.gender === "female").length;
    const numberMales = familyData.filter((member) => member.gender === "male").length;

    const adultText = `${householdSize} (${convertPlural(
        householdSize - children.length,
        "Adult"
    )}`;
    const childText = `${children.length} Child${children.length ? "ren" : ""})`;
    const femaleText = `${convertPlural(numberFemales, "Female")}`;
    const maleText = `${convertPlural(numberMales, "Male")}`;
    const otherText = `${convertPlural(householdSize - numberFemales - numberMales, "Other")}`;

    return {
        householdSize: `${adultText} ${childText}`,
        genderBreakdown: `${femaleText} ${maleText} ${otherText}`,
        ageAndGenderOfAdults: displayList(formattedAdults.map((adult) => getAdult(adult))),
        numberOfBabies: numberBabies.toString(),
        ageAndGenderOfChildren: displayList(formattedChildren.map((child) => getChild(child))),
    };
};
