import supabase, { Schema } from "@/supabase";
import { formatDatetimeAsDate } from "@/app/clients/getClientsTableData";
import { Data } from "@/components/DataViewer/DataViewer";

// TODO Handle errors returned by supabase

type RawClientDetails = Awaited<ReturnType<typeof getRawClientDetails>>;

// TODO Reduce number of explicit fields in clients request (use *?)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getRawClientDetails = async (parcelId: string) => {
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
                primary_key
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

const rawDataToExpandedClientDetails = (
    rawClientDetails: RawClientDetails
): ExpandedClientDetails => {
    if (rawClientDetails === null) {
        return {}; // TODO Handle THis Case
    }

    const client = rawClientDetails.client!;

    return {
        "voucher_#": rawClientDetails.voucher_number,
        full_name: client.full_name,
        phone_number: client.phone_number,
        packing_date: formatDatetimeAsDate(rawClientDetails.packing_datetime),
        delivery_instructions: client.delivery_instructions,
        address: formatAddressFromClientDetails(client),
        household: "",
        "Age & Gender of Children": "",
        dietary_requirements: client.dietary_requirements.join(", "),
        feminine_products: client.feminine_products.join(", "),
        baby_products: client.baby_food,
        pet_food: client.pet_food.join(", "),
        other_requirements: client.other_items.join(", "),
        extra_information: client.extra_information,
    };
};

const formatAddressFromClientDetails = (
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

const formatHouseholdFromFamilyDetails = (familyDetails: Pick<Schema["families"]>[]): string => {
    let count = 0;

    for (const familyGroup of familyDetails) {
        count += familyGroup.quantity;
    }

    if (count <= 1) {
        return "Single";
    }

    if (count <= 9) {
        return `Family of ${count}`;
    }

    return "Family of 10+";
};

export const getExpandedClientDetails = async (parcelId: string) => {
    const rawDetails = await getRawClientDetails(parcelId);
    return rawDataToExpandedClientDetails(rawDetails);
};
