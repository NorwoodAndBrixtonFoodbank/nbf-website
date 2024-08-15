import { ListType } from "@/common/fetch";
import { BooleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { Person } from "@/components/Form/formFunctions";

export interface Address {
    [key: string]: string | null;
    addressLine1: string;
    addressLine2: string | null;
    addressTown: string;
    addressCounty: string | null;
    addressPostcode: string;
}

export interface AdultInfo {
    adults: Person[];
    numberOfAdults: number;
}

export interface ChildrenInfo {
    children: Person[];
    numberOfChildren: number;
}

export interface CollectionInfo {
    collectionDate: string;
    collectionSlot: string;
    collectionCentreId: string;
}

export interface OverrideClient {
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

export interface BatchClient {
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

export interface OverrideParcel {
    [key: string]: string | null | CollectionInfo;
    voucherNumber: string | null;
    packingDate: string | null;
    packingSlot: string | null;
    shippingMethod: string | null;
    collectionInfo: CollectionInfo | null;
}

export interface BatchParcel {
    [key: string]: string | null | CollectionInfo;
    voucherNumber: string | null;
    packingDate: string;
    packingSlot: string;
    shippingMethod: string;
    collectionInfo: CollectionInfo | null;
}

export interface OverrideData {
    client: OverrideClient;
    parcel: OverrideParcel;
}

export interface BatchEditData {
    client: BatchClient;
    clientReadOnly: boolean;
    parcel: BatchParcel | null;
}
export interface OverrideDataRow {
    data: OverrideData | null;
}

export interface BatchDataRow {
    id: number;
    clientId: string | null;
    data: BatchEditData | null;
}

export type clientCellValueType =
    | string
    | Address
    | AdultInfo
    | ChildrenInfo
    | ListType
    | BooleanGroup
    | boolean
    | null;

export type clientOverrideCellValueType = Exclude<clientCellValueType, null>;

export type parcelCellValueType = string | CollectionInfo | null;

export type parcelOverrideCellValueType = Exclude<parcelCellValueType, null>;

export interface BatchTableDataState {
    overrideDataRow: OverrideDataRow;
    batchDataRows: BatchDataRow[];
    clientOverrides: {
        field: keyof BatchClient;
        value: clientOverrideCellValueType;
    }[];
    parcelOverrides: {
        field: keyof BatchParcel;
        value: parcelOverrideCellValueType;
    }[];
}

interface updateCellPayload {
    rowId: number;
    newClientValue?: clientCellValueType;
    newParcelValue?: parcelCellValueType;
    fieldNameClient?: keyof BatchClient;
    fieldNameParcel?: keyof BatchParcel;
}
interface deleteRowPayload {
    rowId: number;
}
interface overrideColumnPayload {
    newOverrideRow: OverrideDataRow;
}
type removeOverrideColumnPayload =
    | {
          clientField: keyof BatchClient;
          parcelField?: undefined;
      }
    | {
          clientField?: undefined;
          parcelField: keyof BatchParcel;
      };
interface useExistingClientPayload {
    rowId: number;
    existingClientId: string;
}

interface initialiseTableStatePayload {
    initialTableState: BatchTableDataState;
}

interface BatchActionInitialTableState {
    type: "initialise_table_state";
    payload: initialiseTableStatePayload;
}
interface BatchActionUpdateCell {
    type: "update_cell";
    updateCellPayload: updateCellPayload;
}
interface BatchActionAddRow {
    type: "add_row";
}
interface BatchActionDeleteRow {
    type: "delete_row";
    deleteRowPayload: deleteRowPayload;
}
interface BatchActionOverrideColumn {
    type: "override_column";
    overrideColumnPayload: overrideColumnPayload;
}
interface BatchActionRemoveOverrideColumn {
    type: "remove_override_column";
    removeOverrideColumnPayload: removeOverrideColumnPayload;
}
interface BatchActionRemoveAllOverrides {
    type: "remove_all_overrides";
}
interface BatchActionUseExistingClient {
    type: "use_existing_client";
    useExistingClientPayload: useExistingClientPayload;
}

export type BatchActionType =
    | BatchActionUpdateCell
    | BatchActionAddRow
    | BatchActionDeleteRow
    | BatchActionOverrideColumn
    | BatchActionUseExistingClient
    | BatchActionRemoveOverrideColumn
    | BatchActionRemoveAllOverrides
    | BatchActionInitialTableState;
