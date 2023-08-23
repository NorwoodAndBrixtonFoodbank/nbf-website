import { Schema } from "@/database_utils";
import { Person } from "@/components/Form/formFunctions";

interface NappySizeAndExtraInformation {
    nappySize: string;
    extraInformation: string;
}

export interface ClientSummary {
    name: string;
    contact: string;
    address: string;
    extraInformation: string;
}

export interface HouseholdSummary {
    householdSize: string;
    genderBreakdown: string;
    numberOfBabies: string;
    ageAndGenderOfChildren: string;
}

export interface RequirementSummary {
    feminineProductsRequired: string;
    babyProductsRequired: string;
    petFoodRequired: string;
    dietaryRequirements: string;
    otherItems: string;
}

export const formatCamelCaseKey = (objectKey: string): string => {
    const withSpace = objectKey.replaceAll(/([a-z])([A-Z])/g, "$1 $2");
    return withSpace.charAt(0).toUpperCase() + withSpace.slice(1);
};

export const processExtraInformation = (original: string): NappySizeAndExtraInformation => {
    if (original.startsWith("Nappy Size: ")) {
        const [nappySize, extraInformation] = original.split(", Extra Information: ");
        return { nappySize: nappySize, extraInformation: extraInformation };
    }
    return { nappySize: "", extraInformation: original };
};

export const prepareClientSummary = (clientData: Schema["clients"]): ClientSummary => {
    const {
        address_1,
        address_2,
        address_county,
        address_postcode,
        address_town,
        full_name,
        phone_number,
    } = clientData;
    const address = [address_1, address_2, address_county, address_postcode, address_town]
        .filter((value) => value !== "")
        .join("\n");

    const { extraInformation } = processExtraInformation(clientData.extra_information);

    return {
        name: full_name,
        contact: phone_number,
        address: address,
        extraInformation: extraInformation,
    };
};

const getChild = (child: Person): string => {
    const gender = child.gender === "male" ? "M" : child.gender === "female" ? "F" : "-";
    return `${child.age} ${gender}`;
};

const displayList = (data: string[]): string => {
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

export const prepareRequirementSummary = (clientData: Schema["clients"]): RequirementSummary => {
    let babyProduct: string;
    if (clientData.baby_food) {
        const { nappySize } = processExtraInformation(clientData.extra_information);
        babyProduct = `Yes (${nappySize})`;
    } else {
        babyProduct = clientData.baby_food === null ? "Don't Know" : "No";
    }

    return {
        feminineProductsRequired: displayList(clientData.feminine_products),
        babyProductsRequired: babyProduct,
        petFoodRequired: displayList(clientData.pet_food),
        dietaryRequirements: displayList(clientData.dietary_requirements),
        otherItems: displayList(clientData.other_items),
    };
};
