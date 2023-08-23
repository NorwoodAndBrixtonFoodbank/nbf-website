import { Person } from "@/components/Form/formFunctions";
import { Schema } from "@/database_utils";

export interface HouseholdSummary {
    householdSize: string;
    genderBreakdown: string;
    numberOfBabies: string;
    ageAndGenderOfChildren: string;
}

const getChild = (child: Person): string => {
    const gender = child.gender === "male" ? "M" : child.gender === "female" ? "F" : "-";
    return `${child.age} ${gender}`;
};

export const displayList = (data: string[]): string => {
    return data.length === 0 ? "None" : data.join(", ");
};

const convertPlural = (value: number, description: string): string => {
    return `${value} ${description}${value !== 1 ? "s" : ""}`;
};

export const prepareHouseholdSummary = (familyData: Schema["families"][]): HouseholdSummary => {
    const children = familyData.filter((member) => member.age !== null);

    const householdSize = familyData.length;
    const numberBabies = familyData.filter((member) => member.age === 0).length;
    const numberFemales = familyData.filter((member) => member.gender === "female").length;
    const numberMales = familyData.filter((member) => member.gender === "male").length;

    return {
        householdSize: `${householdSize} (${convertPlural(
            householdSize - children.length,
            "Adult"
        )} ${children.length} Child${children.length ? "ren" : ""})`,
        genderBreakdown: `${convertPlural(numberFemales, "Female")} ${convertPlural(
            numberMales,
            "Male"
        )} ${convertPlural(householdSize - numberFemales - numberMales, "Other")}`,
        numberOfBabies: numberBabies.toString(),
        ageAndGenderOfChildren: displayList(children.map(getChild)),
    };
};
