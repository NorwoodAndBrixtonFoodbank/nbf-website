import {
    fetchClients,
    fetchFamilies,
    fetchLists,
    fetchParcels,
} from "@/pdf/ShoppingList/databaseFetch";
import { Schema } from "@/supabase";
import { Person } from "@/components/Form/formFunctions";

export interface BlockProps {
    [key: string]: string;
}

interface ParcelInfoAndClientID {
    parcelInfo: ParcelInfo;
    clientID: string;
}

interface ClientDataAndFamilyData {
    clientData: Schema["clients"];
    familyData: Schema["families"][];
}

interface NappySizeAndExtraInformation {
    nappySize: string;
    extraInformation: string;
}

export interface ShoppingListPDFProps {
    postcode: string;
    parcelInfo: ParcelInfo;
    clientSummary: ClientSummary;
    householdSummary: HouseholdSummary;
    requirementSummary: RequirementSummary;
    itemsList: Item[];
    endNotes: string;
}

export interface ParcelInfo extends BlockProps {
    voucherNumber: string;
    packingDate: string;
    collectionDate: string;
    collectionSite: string;
}

export interface ClientSummary {
    name: string;
    contact: string;
    address: string;
    extraInformation: string;
}

export interface HouseholdSummary extends BlockProps {
    householdSize: string;
    genderBreakdown: string;
    numberOfBabies: string;
    ageAndGenderOfChildren: string;
}

export interface RequirementSummary extends BlockProps {
    feminineProductsRequired: string;
    babyProductsRequired: string;
    petFoodRequired: string;
    dietaryRequirements: string;
    otherItems: string;
}

export interface Item {
    description: string;
    quantity: string;
    notes: string;
}

const formatDate = (dateString: string | null): string => {
    if (!dateString) {
        return "";
    }
    return new Date(dateString).toLocaleString("en-GB", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
};

const prepareParcelInfo = async (parcelID: string): Promise<ParcelInfoAndClientID> => {
    const fetchedData = await fetchParcels(parcelID);
    const parcelInfo: ParcelInfo = {
        voucherNumber: fetchedData.voucher_number ?? "",
        packingDate: formatDate(fetchedData.packing_datetime),
        collectionDate: formatDate(fetchedData.collection_datetime),
        collectionSite: fetchedData.collection_centre ?? "",
    };

    if (parcelInfo.collectionSite === "Delivery") {
        parcelInfo.collectionSite = "N/A - Delivery";
    }

    return { parcelInfo: parcelInfo, clientID: fetchedData.client_id };
};

const getClientAndFamilyData = async (clientID: string): Promise<ClientDataAndFamilyData> => {
    const clientData = await fetchClients(clientID);
    const familyData = await fetchFamilies(clientData.family_id);

    return { clientData: clientData, familyData: familyData };
};

const processExtraInformation = (original: string): NappySizeAndExtraInformation => {
    if (original.startsWith("Nappy Size: ")) {
        const [nappySize, extraInformation] = original.split(", Extra Information: ", 1);
        return { nappySize: `(${nappySize})`, extraInformation: extraInformation };
    }
    return { nappySize: "", extraInformation: original };
};

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

const getQuantityAndNotes = (
    row: Schema["lists"],
    size: number
): Pick<Item, "quantity" | "notes"> => {
    if (size >= 10) {
        size = 10;
    }
    const size_quantity = `${size}_quantity` as keyof Schema["lists"];
    const size_notes = `${size}_notes` as keyof Schema["lists"];
    return {
        quantity: row[size_quantity] ?? "",
        notes: row[size_notes] ?? "",
    };
};

const prepareItemsList = async (householdSize: number): Promise<Item[]> => {
    const listData = await fetchLists();
    return listData.map((row): Item => {
        return {
            description: row.item_name,
            ...getQuantityAndNotes(row, householdSize),
        };
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getEndNotes = (_parcelID: string): string => {
    return "PLEASE DISTRIBUTE WEIGHT EVENLY ACROSS BOXES. Space is valuable! Please don't leave boxes half empty - pack efficiently! BOXES MUST BE PACKED FLAT SO THAT THEY CAN BE STACKED. Do not leave items sticking out of the top. We do have a selection of 'free from' goods as well as vegan and halal products. If you're uncertain about anything, please speak to a member of the team.";
    // This is hard coded for now. _parcelID is also not used for now.
};

const prepareData = async (parcelID: string): Promise<ShoppingListPDFProps> => {
    const { parcelInfo, clientID } = await prepareParcelInfo(parcelID);
    const { clientData, familyData } = await getClientAndFamilyData(clientID);
    const itemsList = await prepareItemsList(familyData.length);

    const clientSummary = prepareClientSummary(clientData);
    const householdSummary = prepareHouseholdSummary(familyData);
    const requirementSummary = prepareRequirementSummary(clientData);

    const { nappySize, extraInformation } = processExtraInformation(clientData.extra_information);
    clientSummary.extraInformation = extraInformation;
    requirementSummary.babyProductsRequired += ` ${nappySize}`;

    const endNotes = getEndNotes(parcelID);

    const data: ShoppingListPDFProps = {
        postcode: clientData.address_postcode,
        parcelInfo: parcelInfo,
        clientSummary: clientSummary,
        householdSummary: householdSummary,
        requirementSummary: requirementSummary,
        itemsList: itemsList,
        endNotes: endNotes,
    };
    return data;
};

export default prepareData;
