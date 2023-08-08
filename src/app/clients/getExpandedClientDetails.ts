import supabase, { Schema } from "@/supabase";
import {
    familyCountToFamilyCategory,
    formatDatetimeAsDate,
} from "@/app/clients/getClientsTableData";
import { Data } from "@/components/DataViewer/DataViewer";

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

export interface ExpandedClientDetails extends Data {
    "voucher_#": Schema["parcels"]["voucher_number"];
    full_name: Schema["clients"]["full_name"];
    phone_number: Schema["clients"]["phone_number"];
    packing_date: string;
    packing_time: string;
    delivery_instructions: Schema["clients"]["delivery_instructions"];
    address: string;
    household: string;
    "Age & Gender of Children": string;
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
            "Age & Gender of Children": "",
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
        "Age & Gender of Children": formatBreakdownOfChildrenFromFamilyDetails(client.family),
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

    const time = new Date(datetime);

    const hours = time.getHours();
    const minutes = time.getMinutes();

    const HH = hours < 10 ? "0" + hours : hours;
    const MM = minutes < 10 ? "0" + minutes : minutes;

    return `${HH}:${MM}`;
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
    let noAdults = 0;
    let noChildren = 0;

    for (const familyMember of family) {
        if (familyMember.age === null || familyMember.age >= 18) {
            noAdults++;
        } else {
            noChildren++;
        }
    }

    const adultChildBreakdown = [];

    if (noAdults > 0) {
        adultChildBreakdown.push(`${noAdults} ${noAdults > 1 ? "adults" : "adult"}`);
    }

    if (noChildren > 0) {
        adultChildBreakdown.push(`${noChildren} ${noChildren > 1 ? "children" : "child"}`);
    }

    const familyCategory = familyCountToFamilyCategory(family.length);
    const occupantDisplay = `Occupant${noAdults + noChildren > 1 ? "s" : ""}`;

    return `${familyCategory} ${occupantDisplay} (${adultChildBreakdown.join(", ")})`;
};

export const formatBreakdownOfChildrenFromFamilyDetails = (
    family: Pick<Schema["families"], "age" | "gender">[]
): string => {
    const childDetails = [];

    for (const familyMember of family) {
        if (familyMember.age !== null && familyMember.age < 18) {
            const age = familyMember.age === -1 ? "0-17" : familyMember.age;
            childDetails.push(`${age}-year-old ${familyMember.gender}`);
        }
    }

    if (childDetails.length === 0) {
        return "No Children";
    }

    return childDetails.join(", ");
};

export const getExpandedClientDetails = async (
    parcelId: string
): Promise<ExpandedClientDetails> => {
    const rawDetails = await getRawClientDetails(parcelId);
    return rawDataToExpandedClientDetails(rawDetails);
};
