import { Schema } from "@/database_utils";
import { displayList } from "@/common/formatFamiliesData";

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

export interface RequirementSummary {
    feminineProductsRequired: string;
    babyProductsRequired: string;
    petFoodRequired: string;
    dietaryRequirements: string;
    otherItems: string;
}

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
