import { Schema } from "@/database_utils";
import supabase from "@/supabaseClient";
import {
    fetchClients,
    fetchComment,
    fetchFamilies,
    fetchLists,
    fetchParcels,
} from "@/common/fetch";
import {
    ClientSummary,
    HouseholdSummary,
    prepareClientSummary,
    prepareHouseholdSummary,
    prepareRequirementSummary,
    processExtraInformation,
    RequirementSummary,
} from "@/common/format";

export interface ParcelInfo {
    voucherNumber: string;
    packingDate: string;
    collectionDate: string;
    collectionSite: string;
}

interface ParcelInfoAndClientID {
    parcelInfo: ParcelInfo;
    clientID: string;
}

interface ClientDataAndFamilyData {
    clientData: Schema["clients"];
    familyData: Schema["families"][];
}

export interface ShoppingListPDFDataProps {
    postcode: string;
    parcelInfo: ParcelInfo;
    clientSummary: ClientSummary;
    householdSummary: HouseholdSummary;
    requirementSummary: RequirementSummary;
    itemsList: Item[];
    endNotes: string;
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
    const fetchedData = await fetchParcels(parcelID, supabase);
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
    const clientData = await fetchClients(clientID, supabase);
    const familyData = await fetchFamilies(clientData.family_id, supabase);

    return { clientData: clientData, familyData: familyData };
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
        quantity: row[size_quantity]?.toString() ?? "",
        notes: row[size_notes]?.toString() ?? "",
    };
};

const prepareItemsList = async (householdSize: number): Promise<Item[]> => {
    const listData = await fetchLists(supabase);
    return listData.map((row): Item => {
        return {
            description: row.item_name,
            ...getQuantityAndNotes(row, householdSize),
        };
    });
};

const prepareData = async (parcelID: string): Promise<ShoppingListPDFDataProps> => {
    const { parcelInfo, clientID } = await prepareParcelInfo(parcelID);
    const { clientData, familyData } = await getClientAndFamilyData(clientID);
    const itemsList = await prepareItemsList(familyData.length);

    const clientSummary = prepareClientSummary(clientData);
    const householdSummary = prepareHouseholdSummary(familyData);
    const requirementSummary = prepareRequirementSummary(clientData);

    const { nappySize } = processExtraInformation(clientData.extra_information);
    requirementSummary.babyProductsRequired += ` (${nappySize})`;

    const endNotes = await fetchComment(supabase);

    return {
        postcode: clientData.address_postcode,
        parcelInfo: parcelInfo,
        clientSummary: clientSummary,
        householdSummary: householdSummary,
        requirementSummary: requirementSummary,
        itemsList: itemsList,
        endNotes: endNotes,
    };
};

export default prepareData;
