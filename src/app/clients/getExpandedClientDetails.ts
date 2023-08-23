import { RawClientDetails } from "@/app/clients/fetchDataFromServer";
import { Schema } from "@/database_utils";
import { Data } from "@/components/DataViewer/DataViewer";

export const familyCountToFamilyCategory = (count: number): string => {
    if (count <= 1) {
        return "Single";
    }

    if (count <= 9) {
        return `Family of ${count}`;
    }

    return "Family of 10+";
};

export const formatDatetimeAsDate = (datetime: string | null): string => {
    if (datetime === null || isNaN(Date.parse(datetime))) {
        return "-";
    }

    return new Date(datetime).toLocaleDateString("en-GB");
};

export interface ExpandedClientDetails extends Data {
    "voucher_#": Schema["parcels"]["voucher_number"];
    full_name: Schema["clients"]["full_name"];
    phone_number: Schema["clients"]["phone_number"];
    packing_date: string;
    packing_time: string;
    delivery_instructions: Schema["clients"]["delivery_instructions"];
    address: string;
    household: string;
    "age_&_gender_of_children": string;
    dietary_requirements: string;
    feminine_products: string;
    baby_products: Schema["clients"]["baby_food"];
    pet_food: string;
    other_requirements: string;
    extra_information: Schema["clients"]["extra_information"];
}

export const rawDataToExpandedClientDetails = (
    rawClientDetails: RawClientDetails
): ExpandedClientDetails => {
    if (rawClientDetails === null) {
        return {
            "voucher_#": "",
            full_name: "",
            phone_number: "",
            packing_date: "",
            packing_time: "",
            delivery_instructions: "",
            address: "",
            household: "",
            "age_&_gender_of_children": "",
            dietary_requirements: "",
            feminine_products: "",
            baby_products: null,
            pet_food: "",
            other_requirements: "",
            extra_information: "",
        };
    }

    const client = rawClientDetails.client!;

    return {
        "voucher_#": rawClientDetails.voucher_number,
        full_name: client.full_name,
        phone_number: client.phone_number,
        packing_date: formatDatetimeAsDate(rawClientDetails.packing_datetime),
        packing_time: formatDatetimeAsTime(rawClientDetails.packing_datetime),
        delivery_instructions: client.delivery_instructions,
        address: formatAddressFromClientDetails(client),
        household: formatHouseholdFromFamilyDetails(client.family),
        "age_&_gender_of_children": formatBreakdownOfChildrenFromFamilyDetails(client.family),
        dietary_requirements: client.dietary_requirements.join(", "),
        feminine_products: client.feminine_products.join(", "),
        baby_products: client.baby_food,
        pet_food: client.pet_food.join(", "),
        other_requirements: client.other_items.join(", "),
        extra_information: client.extra_information,
    };
};

export const formatDatetimeAsTime = (datetime: string | null): string => {
    if (datetime === null || isNaN(Date.parse(datetime))) {
        return "-";
    }

    return new Date(datetime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

export const formatAddressFromClientDetails = (
    client: Pick<
        Schema["clients"],
        "address_1" | "address_2" | "address_town" | "address_county" | "address_postcode"
    >
): string => {
    return [
        client.address_1,
        client.address_2,
        client.address_town,
        client.address_county,
        client.address_postcode,
    ]
        .filter((field) => field)
        .join(", ");
};

export const formatHouseholdFromFamilyDetails = (
    family: Pick<Schema["families"], "age" | "gender">[]
): string => {
    let adultCount = 0;
    let childCount = 0;

    for (const familyMember of family) {
        if (familyMember.age === null || familyMember.age >= 16) {
            adultCount++;
        } else {
            childCount++;
        }
    }

    const adultChildBreakdown = [];

    if (adultCount > 0) {
        adultChildBreakdown.push(`${adultCount} adult${adultCount > 1 ? "s" : ""}`);
    }

    if (childCount > 0) {
        adultChildBreakdown.push(`${childCount} child${childCount > 1 ? "ren" : ""}`);
    }

    const familyCategory = familyCountToFamilyCategory(family.length);
    const occupantDisplay = `Occupant${adultCount + childCount > 1 ? "s" : ""}`;

    return `${familyCategory} ${occupantDisplay} (${adultChildBreakdown.join(", ")})`;
};

export const formatBreakdownOfChildrenFromFamilyDetails = (
    family: Pick<Schema["families"], "age" | "gender">[]
): string => {
    const childDetails = [];

    for (const familyMember of family) {
        if (familyMember.age !== null && familyMember.age <= 15) {
            const age = familyMember.age === -1 ? "0-15" : familyMember.age.toString();
            childDetails.push(`${age}-year-old ${familyMember.gender}`);
        }
    }

    if (childDetails.length === 0) {
        return "No Children";
    }

    return childDetails.join(", ");
};
