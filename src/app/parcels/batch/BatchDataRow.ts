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
    voucherNumber: string | null;
    packingDate: string | null;
    packingSlot: string | null;
    shippingMethod: string | null;
    collectionInfo: CollectionInfo | null;
}

interface BatchParcel {
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
    rowId: string | 0;
    fieldName: FieldName;
    cellValue: BatchCellType;
}

interface FieldNameClient {client: keyof BatchClient, parcel: null};
interface FieldNameParcel {client: null, parcel: keyof BatchParcel};
type FieldName = FieldNameClient | FieldNameParcel;

type BatchCellTypeClient = string | boolean | Address | AdultInfo | ChildrenInfo | BooleanGroup | null
interface BatchCellInterfaceClient {client: BatchCellTypeClient, parcel: undefined};
type BatchCellTypeParcel = string | CollectionInfo | null | undefined;
interface BatchCellInterfaceParcel {client: undefined, parcel: BatchCellTypeParcel};
type BatchCellType = BatchCellInterfaceClient | BatchCellInterfaceParcel;

export const reducer = (state: BatchTableDataState, action: BatchActionType) : BatchTableDataState => {
    switch (action.type) {
        case 'update_cell':{
            const rowToBeUpdated: BatchDataRow | undefined = state.batchDataRows.find(row => row.id === action.payload?.rowId)
            if(rowToBeUpdated && action.payload?.fieldName) {
                if(rowToBeUpdated.data && rowToBeUpdated.data?.client && action.payload?.fieldName.client && action.payload?.cellValue.client !== undefined) {
                    const fieldName = action.payload?.fieldName.client;
                    const updatedRow: BatchDataRow = {...rowToBeUpdated};
                    if(updatedRow.data) {
                        updatedRow.data.client[fieldName] = 'a'
                    }
                }
            }
        // return row && action.payload?.fieldName? {
        //         ...state,
        //         batchDataRows: row[action.payload?.fieldName] = action.payload?.cellValue
        //     } : state;
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
            return {
                ...state
            }
        };
        case 'use_existing_client': {
            return {
                ...state
            }
        };
    }
}


