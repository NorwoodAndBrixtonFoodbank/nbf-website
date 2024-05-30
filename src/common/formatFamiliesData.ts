import { Person } from "@/components/Form/formFunctions";
import { Schema } from "@/databaseUtils";
import { displayList } from "@/common/format";
import {
    getAdultAgeUsingBirthYear,
    getChildAgeUsingBirthYearAndMonth,
    isAdultPerson,
    isChildPerson,
} from "@/common/getAgesOfFamily";
import { getCurrentYear } from "@/common/date";

export interface HouseholdSummary {
    householdSize: string;
    genderBreakdown: string;
    ageAndGenderOfAdults: string;
    numberOfBabies: string;
    ageAndGenderOfChildren: string;
}

const getPerson = (person: Person, age: string): string => {
    let gender;
    switch (person.gender) {
        case "male":
            gender = "M";
            break;
        case "female":
            gender = "F";
            break;
        case "other":
            gender = "O";
            break;
    }
    return `${age} ${gender}`;
};

const convertPlural = (value: number, description: string): string => {
    return `${value} ${description}${value !== 1 ? "s" : ""}`;
};

export const getFormattedPeople = (
    familyData: Schema["families"][],
    filterFunction: (person: Schema["families"]) => boolean
): Person[] => {
    const people = familyData.filter((member) => filterFunction(member));
    return people.map((person) => {
        return {
            gender: person.gender,
            birthMonth: person.birth_month,
            birthYear: person.birth_year,
        };
    });
};

export const prepareHouseholdSummary = (familyData: Schema["families"][]): HouseholdSummary => {
    const formattedChildren: Person[] = getFormattedPeople(familyData, isChildPerson);
    const formattedAdults: Person[] = getFormattedPeople(familyData, isAdultPerson);
    const householdSize = familyData.length;
    const numberBabies = familyData.filter(
        (member) => member.birth_year === getCurrentYear()
    ).length;
    const numberFemales = familyData.filter((member) => member.gender === "female").length;
    const numberMales = familyData.filter((member) => member.gender === "male").length;

    const adultText = `${householdSize} (${convertPlural(
        householdSize - formattedChildren.length,
        "Adult"
    )}`;
    const childText = `${formattedChildren.length} Child${formattedChildren.length ? "ren" : ""})`;
    const femaleText = `${convertPlural(numberFemales, "Female")}`;
    const maleText = `${convertPlural(numberMales, "Male")}`;
    const otherText = `${convertPlural(householdSize - numberFemales - numberMales, "Other")}`;

    return {
        householdSize: `${adultText} ${childText}`,
        genderBreakdown: `${femaleText} ${maleText} ${otherText}`,
        ageAndGenderOfAdults: displayList(
            formattedAdults.map((adult) =>
                getPerson(adult, getAdultAgeUsingBirthYear(adult.birthYear, true))
            )
        ),
        numberOfBabies: numberBabies.toString(),
        ageAndGenderOfChildren: displayList(
            formattedChildren.map((child) =>
                getPerson(
                    child,
                    getChildAgeUsingBirthYearAndMonth(
                        child.birthYear,
                        child.birthMonth ?? null,
                        true
                    )
                )
            )
        ),
    };
};
