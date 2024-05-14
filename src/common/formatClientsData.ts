import { Schema } from "@/databaseUtils";
import { displayList, displayNameForDeletedClient, nullPostcodeDisplay } from "@/common/format";
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
    if (!original.startsWith("Nappy Size: ")) {
        return { nappySize: "", extraInformation: original };
    }

    const [nappySize, extraInformation] = original.split(", Extra Information: ");
    return { nappySize: nappySize, extraInformation: extraInformation };
};

export const prepareClientSummary = (clientData: Schema["clients"]): ClientSummary => {
    const {
        address_1,
        address_2,
        address_town,
        address_county,
        address_postcode,
        full_name,
        phone_number,
        extra_information,
        is_active
    } = clientData;

    const formattedAddress = [address_1, address_2, address_town, address_county, address_postcode]
        .filter((value) => value !== "")
        .join("\n");

    const { extraInformation } = processExtraInformation(extra_information ?? "");

    if (is_active) {return {
        name: full_name ?? "",
        contact: phone_number ?? "",
        address: address_postcode ? formattedAddress : nullPostcodeDisplay,
        extraInformation: extraInformation,
    };}
    return {name: displayNameForDeletedClient, contact: "-", address: "-", extraInformation: "-"}
};

export const prepareRequirementSummary = (clientData: Schema["clients"]): RequirementSummary => {
    let babyProduct: string;
    const { nappySize } = processExtraInformation(clientData.extra_information ?? "");

    switch (clientData.baby_food) {
        case true:
            babyProduct = `Yes (${nappySize})`;
            break;
        case false:
            babyProduct = "No";
            break;
        case null:
            babyProduct = "Don't Know";
            break;
    }

    return {
        feminineProductsRequired: displayList(clientData.feminine_products ?? []),
        babyProductsRequired: babyProduct,
        petFoodRequired: displayList(clientData.pet_food ?? []),
        dietaryRequirements: displayList(clientData.dietary_requirements ?? []),
        otherItems: displayList(clientData.other_items ?? []),
    };
};
