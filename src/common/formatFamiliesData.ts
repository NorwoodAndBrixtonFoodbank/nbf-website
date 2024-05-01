import { Person } from "@/components/Form/formFunctions";
import { Schema } from "@/databaseUtils";
import { displayList } from "@/common/format";
import { getCurrentYear, isChildUsingBirthYear } from "@/common/getCurrentYear";

export interface HouseholdSummary {
    householdSize: string;
    genderBreakdown: string;
    numberOfBabies: string;
    ageAndGenderOfChildren: string;
}

const getChild = (child: Person): string => {
    const gender = child.gender === "male" ? "M" : child.gender === "female" ? "F" : "-";
    return `${child.birthYear} ${gender}`;
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
            primaryKey: child.primary_key,
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
        numberOfBabies: numberBabies.toString(),
        ageAndGenderOfChildren: displayList(formattedChildren.map((child) => getChild(child))),
    };
};
