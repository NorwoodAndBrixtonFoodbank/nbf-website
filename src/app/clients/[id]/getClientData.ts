import { Schema } from "@/database_utils";
import { fetchClients, fetchFamilies } from "@/app/clients/add/databaseFunctions";
import { Person } from "@/components/Form/formFunctions";

export type ClientData = ClientSummary & HouseholdSummary & RequirementSummary;

interface ClientSummary {
    name: string;
    contact: string;
    address: string;
    extraInformation: string;
}

interface HouseholdSummary {
    householdSize: string;
    genderBreakdown: string;
    numberOfBabies: string;
    ageAndGenderOfChildren: string;
}

interface RequirementSummary {
    feminineProductsRequired: string;
    babyProductsRequired: string;
    petFoodRequired: string;
    dietaryRequirements: string;
    otherItems: string;
}

const prepareClientSummary = (clientData: Schema["clients"]): ClientSummary => {
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

    return {
        name: full_name,
        contact: phone_number,
        address: address,
        extraInformation: "",
    };
};

const prepareRequirementSummary = (clientData: Schema["clients"]): RequirementSummary => {
    let babyProduct: string;
    if (clientData.baby_food) {
        babyProduct = "Yes";
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

const convertPlural = (value: number, description: string): string => {
    return `${value} ${description}${value !== 1 ? "s" : ""}`;
};

const getChild = (child: Person): string => {
    return `${child.age} ${child.gender[0].toUpperCase()}`;
};

const displayList = (data: string[]): string => {
    return data.length === 0 ? "None" : data.join(", ");
};

const prepareHouseholdSummary = (familyData: Schema["families"][]): HouseholdSummary => {
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

const getClientData = async (clientID: string): Promise<ClientData> => {
    const clientData = await fetchClients(clientID);
    const familyData = await fetchFamilies(clientData.family_id);

    return {
        ...prepareClientSummary(clientData),
        ...prepareRequirementSummary(clientData),
        ...prepareHouseholdSummary(familyData),
    };
};

export default getClientData;
