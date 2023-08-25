import { Person } from "@/components/Form/formFunctions";
import { Schema } from "@/database_utils";
import { displayList } from "@/common/format";

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

const convertPlural = (value: number, description: string): string => {
    return `${value} ${description}${value !== 1 ? "s" : ""}`;
};

export const prepareHouseholdSummary = (familyData: Schema["families"][]): HouseholdSummary => {
    const children = familyData.filter((member) => member.age !== null);

    const householdSize = familyData.length;
    const numberBabies = familyData.filter((member) => member.age === 0).length;
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
        ageAndGenderOfChildren: displayList(children.map(getChild)),
    };
};
