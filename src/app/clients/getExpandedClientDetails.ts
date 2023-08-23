import { Schema } from "@/database_utils";
import { Data } from "@/components/DataViewer/DataViewer";
import supabase from "@/supabaseClient";

const getExpandedClientDetails = async (parcelId: string): Promise<ExpandedClientDetails> => {
    const rawClientDetails = await getRawClientDetails(parcelId);
    return rawDataToExpandedClientDetails(rawClientDetails);
};
export default getExpandedClientDetails;

export type RawClientDetails = Awaited<ReturnType<typeof getRawClientDetails>>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getRawClientDetails = async (parcelId: string) => {
    const response = await supabase
        .from("parcels")
        .select(
            `
        voucher_number,
        packing_datetime,

        client:clients(
            primary_key,
            full_name,
            phone_number,
            delivery_instructions,
            address_1,
            address_2,
            address_town,
            address_county,
            address_postcode,

            family:families(
                age,
                gender
            ),

            dietary_requirements,
            feminine_products,
            baby_food,
            pet_food,
            other_items,
            extra_information
        )

    `
        )
        .eq("primary_key", parcelId)
        .single();

    return response.data;
};

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
    voucherNumber: Schema["parcels"]["voucher_number"];
    fullName: Schema["clients"]["full_name"];
    phoneNumber: Schema["clients"]["phone_number"];
    packingDate: string;
    packingTime: string;
    deliveryInstructions: Schema["clients"]["delivery_instructions"];
    address: string;
    household: string;
    ageAndGenderOfChildren: string;
    dietaryRequirements: string;
    feminineProducts: string;
    babyProducts: Schema["clients"]["baby_food"];
    petFood: string;
    otherRequirements: string;
    extraInformation: Schema["clients"]["extra_information"];
}

export const rawDataToExpandedClientDetails = (
    rawClientDetails: RawClientDetails
): ExpandedClientDetails => {
    if (rawClientDetails === null) {
        return {
            voucherNumber: "",
            fullName: "",
            phoneNumber: "",
            packingDate: "",
            packingTime: "",
            deliveryInstructions: "",
            address: "",
            household: "",
            ageAndGenderOfChildren: "",
            dietaryRequirements: "",
            feminineProducts: "",
            babyProducts: null,
            petFood: "",
            otherRequirements: "",
            extraInformation: "",
        };
    }

    const client = rawClientDetails.client!;

    return {
        voucherNumber: rawClientDetails.voucher_number,
        fullName: client.full_name,
        phoneNumber: client.phone_number,
        packingDate: formatDatetimeAsDate(rawClientDetails.packing_datetime),
        packingTime: formatDatetimeAsTime(rawClientDetails.packing_datetime),
        deliveryInstructions: client.delivery_instructions,
        address: formatAddressFromClientDetails(client),
        household: formatHouseholdFromFamilyDetails(client.family),
        ageAndGenderOfChildren: formatBreakdownOfChildrenFromFamilyDetails(client.family),
        dietaryRequirements: client.dietary_requirements.join(", "),
        feminineProducts: client.feminine_products.join(", "),
        babyProducts: client.baby_food,
        petFood: client.pet_food.join(", "),
        otherRequirements: client.other_items.join(", "),
        extraInformation: client.extra_information,
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
