import {
    fetchClients,
    fetchFamilies,
    fetchLists,
    fetchParcels,
} from "@/components/ShoppingList/databaseFetch";
import { Schema } from "@/supabase";
import { Person } from "@/components/Form/formFunctions";

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

export interface ShoppingListProps {
    postcode: string;
    parcelInfo: ParcelInfo;
    clientSummary: ClientSummary;
    householdSummary: HouseholdSummary;
    requirementSummary: RequirementSummary;
    itemsList: Item[];
    endNotes: string;
}

export interface ParcelInfo {
    voucherNumber: string;
    packingDate: string;
    collectionDate: string;
    collectionSite: string;
}

export interface ClientSummary {
    Name: string;
    Contact: string;
    Address: string;
    Extra_Information: string;
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

export interface Item {
    description: string;
    quantity: string;
    notes: string;
}

const formatDate = (dateString: string | null): string => {
    if (dateString === null) {
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
        const [nappySize, extraInformation] = original.split(", Extra Information: ");
        return { nappySize: `(${nappySize})`, extraInformation: extraInformation };
    }
    return { nappySize: "", extraInformation: original };
};

const prepareClientSummary = (clientData: Schema["clients"]): ClientSummary => {
    const { address_1, address_2, address_county, address_postcode, address_town } = clientData;
    const address = [address_1, address_2, address_county, address_postcode, address_town].join(
        "\n"
    );

    return {
        Name: clientData.full_name,
        Contact: clientData.phone_number,
        Address: address,
        Extra_Information: "",
    };
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
        householdSize: `${householdSize} (${householdSize - children.length} Adults ${
            children.length
        } Children)`,
        genderBreakdown: `${numberFemales} Female ${numberMales} Male ${
            householdSize - numberFemales - numberMales
        } Other`,
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

const getQuantity = (row: Schema["lists"], size: number): string => {
    if (size >= 10) {
        return row["10_quantity"] ?? "";
    }
    return row[`${size}_quantity` as keyof Schema["lists"]] ?? "";
};

const getNotes = (row: Schema["lists"], size: number): string => {
    if (size >= 10) {
        return row["10_notes"] ?? "";
    }
    return row[`${size}_notes` as keyof Schema["lists"]] ?? "";
};

const prepareItemsList = async (householdSize: number): Promise<Item[]> => {
    const listData = await fetchLists();
    return listData.map((row): Item => {
        return {
            description: row.item_name,
            quantity: getQuantity(row, householdSize),
            notes: getNotes(row, householdSize),
        };
    });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getEndNotes = (_parcelID: string): string => {
    return "PLEASE DISTRIBUTE WEIGHT EVENLY ACROSS BOXES. Space is valuable! Please don't leave boxes half empty - pack efficiently! BOXES MUST BE PACKED FLAT SO THAT THEY CAN BE STACKED. Do not leave items sticking out of the top. We do have a selection of 'free from' goods as well as vegan and halal products. If you're uncertain about anything, please speak to a member of the team.";
    // This is hard coded for now. _parcelID is also not used for now.
};

const prepareData = async (parcelID: string): Promise<ShoppingListProps> => {
    const { parcelInfo, clientID } = await prepareParcelInfo(parcelID);
    const { clientData, familyData } = await getClientAndFamilyData(clientID);
    const itemsList = await prepareItemsList(familyData.length);

    const clientSummary = prepareClientSummary(clientData);
    const householdSummary: HouseholdSummary = prepareHouseholdSummary(familyData);
    const requirementSummary = prepareRequirementSummary(clientData);

    const { nappySize, extraInformation } = processExtraInformation(clientData.extra_information);
    clientSummary.Extra_Information = extraInformation;
    requirementSummary.babyProductsRequired += `${nappySize}`;

    const endNotes = getEndNotes(parcelID);

    const data: ShoppingListProps = {
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
