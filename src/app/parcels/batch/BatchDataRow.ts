import { ListType } from "@/common/fetch";
import { BooleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { Person } from "@/components/Form/formFunctions";
import { logErrorReturnLogId } from "@/logger/logger";
import { getFamilySupabaseCall, getClientSupabaseCall } from "@/app/parcels/batch/supabaseCalls";

interface Address {
    addressLine1: string;
    addressLine2: string | null;
    addressTown: string;
    addressCounty: string | null;
    addressPostcode: string;
}

interface AdultInfo {
    adults: Person[];
    numberOfAdults: number;
}

interface ChildrenInfo {
    children: Person[];
    numberOfChildren: number;
}

interface CollectionInfo {
    collectionDate: string;
    collectionSlot: string;
    collectionCentreId: string;
}

interface OverrideClient {
    [key: string]:
        | string
        | null
        | Address
        | AdultInfo
        | ChildrenInfo
        | ListType
        | BooleanGroup
        | boolean;
    phoneNumber: string | null;
    address: Address | null;
    adultInfo: AdultInfo | null;
    childrenInfo: ChildrenInfo | null;
    listType: ListType | null;
    dietaryRequirements: BooleanGroup | null;
    feminineProducts: BooleanGroup | null;
    babyProducts: boolean | null;
    nappySize: string | null;
    petFood: BooleanGroup | null;
    otherItems: BooleanGroup | null;
    deliveryInstructions: string | null;
    extraInformation: string | null;
    attentionFlag: boolean | null;
    signpostingCall: boolean | null;
    notes: string | null;
}

interface BatchClient {
    [key: string]:
        | string
        | null
        | Address
        | AdultInfo
        | ChildrenInfo
        | ListType
        | BooleanGroup
        | boolean;
    fullName: string;
    phoneNumber: string;
    address: Address;
    adultInfo: AdultInfo;
    childrenInfo: ChildrenInfo;
    listType: ListType;
    dietaryRequirements: BooleanGroup;
    feminineProducts: BooleanGroup;
    babyProducts: boolean | null;
    nappySize: string | null;
    petFood: BooleanGroup;
    otherItems: BooleanGroup;
    deliveryInstructions: string | null;
    extraInformation: string | null;
    attentionFlag: boolean;
    signpostingCall: boolean;
    notes: string | null;
}

interface OverrideParcel {
    [key: string]: string | null | CollectionInfo;
    voucherNumber: string | null;
    packingDate: string | null;
    packingSlot: string | null;
    shippingMethod: string | null;
    collectionInfo: CollectionInfo | null;
}

interface BatchParcel {
    [key: string]: string | null | CollectionInfo;
    voucherNumber: string | null;
    packingDate: string;
    packingSlot: string;
    shippingMethod: string;
    collectionInfo: CollectionInfo | null;
}

interface OverrideData {
    client: OverrideClient;
    parcel: OverrideParcel;
}

interface BatchEditData {
    client: BatchClient;
    clientReadOnly: boolean;
    parcel: BatchParcel | null;
}
interface OverrideDataRow {
    data: OverrideData;
}

interface BatchDataRow {
    id: number;
    clientId: string | null;
    data: BatchEditData | null;
}

export interface BatchTableDataState {
    overrideDataRow: OverrideDataRow;
    batchDataRows: BatchDataRow[];
}

export interface BatchActionType {
    type: "update_cell" | "add_row" | "delete_row" | "override_column" | "use_existing_client";
    payload?: BatchActionPayload;
}

interface BatchActionPayload {
    rowId?: number;
    newRow?: BatchDataRow;
    newOverrideRow?: OverrideDataRow;
    existingClientId?: string;
}

const getOverridenFields = (allFields: OverrideClient | OverrideParcel): string[] => {
    return Object.entries(allFields)
        .filter(([_, value]) => value)
        .reduce((acc, [key, _]) => {
            return [...acc, key];
        }, [] as string[]);
};

function createBooleanGroupFromStrings(strings: string[] | null): BooleanGroup {
    const result: BooleanGroup = {};
    if (strings) {
        strings.forEach((str) => {
            result[str] = true;
        });
    }
    return result;
}

const getNappySize = (info: string | null): string | null => {
    if (info) {
        const match = info.match(/Nappy Size:\s*(\d+)/);
        if (match) {
            return match[1];
        }
    }
    return null;
};

const getChildrenAndAdults = async (
    familyId: string
): Promise<{ adults: Person[]; children: Person[] } | null> => {
    const { data, error } = await getFamilySupabaseCall(familyId);

    const adults: Person[] = [];
    const children: Person[] = [];

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    if (error) {
        logErrorReturnLogId("Error with fetch: family_members", { error: error });
        return null;
    } else if (data) {
        data.forEach((person) => {
            const formattedPerson: Person = {
                gender: person.gender,
                birthYear: person.birth_year,
                birthMonth: person.birth_month,
            };

            const yearsDiff = currentYear - formattedPerson.birthYear;

            if (yearsDiff == 16) {
                !formattedPerson.birthMonth
                    ? adults.push(formattedPerson)
                    : currentMonth >= formattedPerson.birthMonth
                      ? adults.push(formattedPerson)
                      : children.push(formattedPerson);
            } else if (yearsDiff < 16) {
                children.push(formattedPerson);
            } else {
                adults.push(formattedPerson);
            }
        });
    } else {
        return { adults: [], children: [] };
    }

    return { adults, children };
};

const parseExtraInfo = (info: string | null): string | null => {
    if (info) {
        const match = info.match(/Nappy Size:\s*\d+,\s*Extra Information:\s*(.*)/);
        if (match) {
            return match[1];
        }
    }
    return info;
};

const getExistingClientData = async (clientId: string): Promise<BatchClient | null> => {
    const { data, error } = await getClientSupabaseCall(clientId);

    if (error) {
        logErrorReturnLogId("Error with fetch: clients", { error: error });
        return null;
    } else if (data) {
        const ChildrenAndAdults = await getChildrenAndAdults(data.family_id);
        if (!ChildrenAndAdults) {
            return null;
        }
        const { adults, children } = ChildrenAndAdults;
        return {
            fullName: data.full_name ?? "",
            phoneNumber: data.phone_number ?? "",
            address: {
                addressLine1: data.address_1 ?? "",
                addressLine2: data?.address_2 ?? "",
                addressTown: data?.address_town ?? "",
                addressCounty: data?.address_county ?? "",
                addressPostcode: data?.address_postcode ?? "",
            },
            adultInfo: {
                adults: adults,
                numberOfAdults: adults.length,
            },
            childrenInfo: {
                children: children,
                numberOfChildren: children.length,
            },
            listType: data.default_list ?? "regular",
            dietaryRequirements: createBooleanGroupFromStrings(data.dietary_requirements),
            feminineProducts: createBooleanGroupFromStrings(data.feminine_products),
            babyProducts: data.baby_food,
            nappySize: getNappySize(data.extra_information),
            petFood: createBooleanGroupFromStrings(data.pet_food),
            otherItems: createBooleanGroupFromStrings(data.other_items),
            deliveryInstructions: data.delivery_instructions,
            extraInformation: parseExtraInfo(data.extra_information),
            attentionFlag: data.flagged_for_attention ?? false,
            signpostingCall: data.signposting_call_required ?? false,
            notes: data.notes,
        };
    } else {
        return null;
    }
};

export const reducer = async (
    state: BatchTableDataState,
    action: BatchActionType
): Promise<BatchTableDataState> => {
    switch (action.type) {
        case "update_cell": {
            if (action.payload && action.payload.newRow) {
                const { rowId, newRow } = action.payload;
                const updatedRows: BatchDataRow[] = state.batchDataRows.map((row) => {
                    return row.id === rowId ? newRow : row;
                });
                return {
                    ...state,
                    batchDataRows: updatedRows,
                };
            } else {
                return state;
            }
        }
        case "add_row": {
            return state.batchDataRows.length < 99
                ? {
                      ...state,
                      batchDataRows: [
                          ...state.batchDataRows,
                          {
                              id:
                                  Math.max(
                                      ...state.batchDataRows.map((row) => {
                                          return row.id;
                                      })
                                  ) + 1,
                              clientId: null,
                              data: null,
                          },
                      ],
                  }
                : state;
        }
        case "delete_row": {
            return action.payload?.rowId !== 0
                ? {
                      ...state,
                      batchDataRows: state.batchDataRows.filter(
                          (row) => row.id !== action.payload?.rowId
                      ),
                  }
                : state;
        }
        case "override_column": {
            if (action.payload?.newOverrideRow) {
                const overriddenClientFields = getOverridenFields(
                    action.payload?.newOverrideRow.data.client
                );
                const overriddenParcelFields = getOverridenFields(
                    action.payload?.newOverrideRow.data.parcel
                );
                const { newOverrideRow } = action.payload;
                return {
                    ...state,
                    batchDataRows: state.batchDataRows.map((row) => {
                        const newRow = { ...row };
                        if (newRow.data) {
                            for (const field in newRow.data.client) {
                                if (overriddenClientFields.includes(field)) {
                                    newRow.data.client[field] = newOverrideRow.data.client[field];
                                }
                            }
                            for (const field in newRow.data.parcel) {
                                if (overriddenParcelFields.includes(field)) {
                                    newRow.data.parcel[field] = newOverrideRow.data.parcel[field];
                                }
                            }
                        }
                        return newRow;
                    }),
                };
            } else {
                return state;
            }
        }
        case "use_existing_client": {
            if (action.payload) {
                const { rowId, existingClientId } = action.payload;
                if (rowId && existingClientId) {
                    const existingClientBatchData = await getExistingClientData(existingClientId);
                    if (existingClientBatchData) {
                        const newRow: BatchDataRow = {
                            id: rowId,
                            clientId: existingClientId,
                            data: {
                                client: existingClientBatchData,
                                clientReadOnly: true,
                                parcel: null,
                            },
                        };
                        const updatedRows: BatchDataRow[] = state.batchDataRows.map((row) => {
                            return row.id === rowId ? newRow : row;
                        });
                        return {
                            ...state,
                            batchDataRows: updatedRows,
                        };
                    }
                }
            }
            return state;
        }
        default: {
            return state;
        }
    }
};
