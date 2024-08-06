import { ListType } from "@/common/fetch";
import { BooleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { Person } from "@/components/Form/formFunctions";
import { UUID } from "crypto";
import { useReducer } from "react";

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
    [key: string]: any;
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
    [key: string]: any;
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
    [key: string]: any;
    voucherNumber: string | null;
    packingDate: string | null;
    packingSlot: string | null;
    shippingMethod: string | null;
    collectionInfo: CollectionInfo | null;
}

interface BatchParcel {
    [key: string]: any;
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

interface BatchData {
    client: BatchClient;
    clientReadOnly: boolean
    parcel: BatchParcel | null;
}

interface OverrideDataRow {
    data: OverrideData;
}

interface BatchDataRow {
    id: string;
    clientId: string | null;
    data: BatchData | null;
}

interface BatchTableDataState {
    overrideDataRow: OverrideDataRow;
    batchDataRows: BatchDataRow[];
}

interface BatchActionType {
    type: 'update_cell' | 'add_row' | 'delete_row' | 'override_column' | 'use_existing_client';
    payload?: BatchActionPayload;
}

interface BatchActionPayload {
    rowId?: string | 0;
    fieldName?: FieldName;
    newRow?: BatchDataRow;
    newOverrideRow?: OverrideDataRow;
}

interface FieldNameClient {client: keyof BatchClient, parcel: null};
interface FieldNameParcel {client: null, parcel: keyof BatchParcel};
type FieldName = FieldNameClient | FieldNameParcel;

const getOverridenFields = (allFields: OverrideClient | OverrideParcel): string[] => {
    return Object.entries(allFields)
                .filter(([_, value]) => value)
                .reduce((acc, [key, _]) => {
                    return [...acc, key];
                }, [] as string[]);
}

export const reducer = (state: BatchTableDataState, action: BatchActionType) : BatchTableDataState => {
    switch (action.type) {
        case 'update_cell':{
            if(action.payload && action.payload.newRow) {
                const {rowId, newRow} = action.payload;
                const updatedRows: BatchDataRow[] = state.batchDataRows.map((row) => {return row.id === rowId ? newRow : row;})
                return {
                    ...state,
                    batchDataRows: updatedRows
                }
            } else {
                return state;
            }
        };   
        case 'add_row': {
            return state.batchDataRows.length < 99 ? {
                ...state,
                batchDataRows: [...state.batchDataRows, {id: crypto.randomUUID(), clientId: null, data: null }]
            } : state;
        };
        case 'delete_row': {
            return action.payload?.rowId !== 0 ? {
                ...state,
                batchDataRows: state.batchDataRows.filter(row => row.id !== action.payload?.rowId)
            } : state;
        };
        case 'override_column': {
            if (action.payload?.newOverrideRow) {
                const overriddenClientFields = getOverridenFields(action.payload?.newOverrideRow.data.client) 
                const overriddenParcelFields = getOverridenFields(action.payload?.newOverrideRow.data.parcel)
                const {newOverrideRow} = action.payload;
                return {
                    ...state,
                    batchDataRows: state.batchDataRows.map((row) => {
                        const newRow = {...row};
                        if(newRow.data) {
                            for (const field in newRow.data.client) {
                                if(overriddenClientFields.includes(field)) {
                                    newRow.data.client[field] = newOverrideRow.data.client[field];
                                }
                            }
                            for (const field in newRow.data.parcel) {
                                if(overriddenParcelFields.includes(field)) {
                                    newRow.data.parcel[field] = newOverrideRow.data.parcel[field];
                                }
                            }
                        }
                        return newRow;
                    })
                }
            }
            
        };
        case 'use_existing_client': {
            if(action.payload && action.payload.newRow) {
                const {rowId, newRow} = action.payload;
                const updatedRows: BatchDataRow[] = state.batchDataRows.map((row) => {return row.id === rowId ? newRow : row;})
                return {
                    ...state,
                    batchDataRows: updatedRows
                }
            } else {
                return state;
            }
        };
    }
}


