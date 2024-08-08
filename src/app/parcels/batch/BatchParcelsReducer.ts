import { BooleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { Person } from "@/components/Form/formFunctions";
import { logErrorReturnLogId } from "@/logger/logger";
import { callGetFamily, callGetClient } from "@/app/parcels/batch/supabaseHelpers";
import {
    BatchTableDataState,
    BatchActionType,
    BatchClient,
    BatchDataRow,
    OverrideClient,
    OverrideParcel,
    clientOverrideCellValueType,
    parcelOverrideCellValueType,
    BatchParcel,
} from "@/app/parcels/batch/BatchTypes";

const getOverridenFieldsAndValues = (
    allFields: OverrideClient | OverrideParcel
): (
    | { field: string; value: clientOverrideCellValueType }
    | { field: string; value: parcelOverrideCellValueType }
)[] => {
    return Object.entries(allFields)
        .filter(([_, value]) => value)
        .reduce(
            (acc, [key, value]) => {
                return [...acc, { field: key, value: value }];
            },
            [] as (
                | { field: string; value: clientOverrideCellValueType }
                | { field: string; value: parcelOverrideCellValueType }
            )[]
        );
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
    const { data, error } = await callGetFamily(familyId);

    const adults: Person[] = [];
    const children: Person[] = [];

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    if (error) {
        logErrorReturnLogId("Error with fetch: family_members", { error: error });
        return null;
    }
    if (!data) {
        return { adults: [], children: [] };
    }
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

const getClientDataForBatchParcels = async (clientId: string): Promise<BatchClient | null> => {
    const { data, error } = await callGetClient(clientId);

    if (error) {
        logErrorReturnLogId("Error with fetch: clients", { error: error });
        return null;
    }
    if (!data) {
        return null;
    }
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
};

export const batchParcelsReducer = async (
    state: BatchTableDataState,
    action: BatchActionType
): Promise<BatchTableDataState> => {
    switch (action.type) {
        case "update_cell": {
            const { rowId, fieldNameClient, fieldNameParcel, newClientValue, newParcelValue } =
                action.updateCellPayload;
            const rowToUpdate = state.batchDataRows.find((row) => row.id === rowId);
            if (!rowToUpdate || !rowToUpdate.data) {
                return state;
            }
            //checks for !== undefined because newClientValue/newParcelValue can be null
            if (fieldNameClient && newClientValue !== undefined) {
                rowToUpdate.data.client[fieldNameClient] = newClientValue;
            } else if (fieldNameParcel && newParcelValue !== undefined && rowToUpdate.data.parcel) {
                rowToUpdate.data.parcel[fieldNameParcel] = newParcelValue;
            } else {
                return state;
            }
            return {
                ...state,
                batchDataRows: state.batchDataRows.map((row) =>
                    row.id === rowId ? rowToUpdate : row
                ),
            };
        }
        case "add_row": {
            const newId: number =
                Math.max(
                    ...state.batchDataRows.map((row) => {
                        return row.id;
                    })
                ) + 1;
            return state.batchDataRows.length < 99
                ? {
                      ...state,
                      batchDataRows: [
                          ...state.batchDataRows,
                          {
                              id: newId,
                              clientId: null,
                              data: null,
                          },
                      ],
                  }
                : state;
        }
        case "delete_row": {
            const { rowId } = action.deleteRowPayload;
            return rowId !== 0
                ? {
                      ...state,
                      batchDataRows: state.batchDataRows.filter((row) => row.id !== rowId),
                  }
                : state;
        }
        case "override_column": {
            const { newOverrideRow } = action.overrideColumnPayload;
            const overriddenClientFieldsAndValues = getOverridenFieldsAndValues(
                newOverrideRow.data.client
            ) as { field: keyof BatchClient; value: clientOverrideCellValueType }[];
            const overriddenParcelFieldsAndValues = getOverridenFieldsAndValues(
                newOverrideRow.data.parcel
            ) as { field: keyof BatchParcel; value: parcelOverrideCellValueType }[];
            return {
                ...state,
                clientOverrides: overriddenClientFieldsAndValues,
                parcelOverrides: overriddenParcelFieldsAndValues,
            };
        }
        case "remove_override_column": {
            const { clientField, parcelField } = action.removeOverrideColumnPayload;
            const updatedClientOverrides = state.clientOverrides.filter(
                (override) => override.field !== clientField
            );
            const updatedParcelOverrides = state.parcelOverrides.filter(
                (override) => override.field !== parcelField
            );
            return {
                ...state,
                clientOverrides: updatedClientOverrides,
                parcelOverrides: updatedParcelOverrides,
            };
        }
        case "remove_all_overrides": {
            return {
                ...state,
                clientOverrides: [],
                parcelOverrides: [],
            };
        }
        case "use_existing_client": {
            const { rowId, existingClientId } = action.useExistingClientPayload;
            const existingClientBatchData = await getClientDataForBatchParcels(existingClientId);
            if (!existingClientBatchData) {
                return state;
            }
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
        default: {
            return state;
        }
    }
};

export default batchParcelsReducer;
