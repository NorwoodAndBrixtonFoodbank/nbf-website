import { ListType } from "@/common/fetch";
import { BooleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { Person } from "@/components/Form/formFunctions";
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
    parcel: BatchParcel | null;
}

interface OverrideDataRow {
    data: OverrideData;
}

interface BatchDataRow {
    clientId: string | null;
    data: BatchData | null;
}

interface BatchTableDataState {
    OverrideDataRow: OverrideDataRow;
    BatchDataRows: BatchDataRow[];
}

interface BatchActionType {
    type: 'update_cell' | 'add_row' | 'delete_row' | 'override_column' | 'use_existing_client';
}

const reducer = (state: BatchTableDataState, action: BatchActionType) : BatchTableDataState => {
    switch (action.type) {
        case 'update_cell':{
            return {
                ...state
            }
        };   
        case 'add_row': {
            return {
                ...state
            }
        };
        case 'delete_row': {
            return {
                ...state
            }
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
    throw Error('Invalid action type: ' + action.type);
}


