import { ServerSideFilter, ServerSideFilterMethod } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { ServerSideSortMethod } from "@/components/Tables/sortMethods";
import { ParcelStatus, ParcelsPlusRow, Schema, ViewSchema } from "@/databaseUtils";

export interface ParcelsTableRow {
    parcelId: Schema["parcels"]["primary_key"];
    clientId: Schema["clients"]["primary_key"];
    fullName: Schema["clients"]["full_name"];
    familyCategory: string;
    addressPostcode: Schema["clients"]["address_postcode"];
    phoneNumber: Schema["clients"]["phone_number"];
    deliveryCollection: {
        collectionCentreName: string;
        collectionCentreAcronym: string;
        congestionChargeApplies: boolean;
    };
    packingSlot: string | null;
    collectionDatetime: Date | null;
    lastStatus: {
        name: string;
        timestamp: Date;
        eventData: string | null;
        workflowOrder: number;
    } | null;
    voucherNumber: string | null;
    iconsColumn: {
        flaggedForAttention: boolean;
        requiresFollowUpPhoneCall: boolean;
    };
    packingDate: Date | null;
    createdAt: Date | null;
}

export type GetParcelDataAndCountResult =
    | {
          data: {
              parcelTableRows: ParcelsTableRow[];
              count: number;
          };
          error: null;
      }
    | {
          data: null;
          error: {
              type: GetParcelDataAndCountErrorType;
              logId: string;
          };
      };

export type GetParcelDataAndCountErrorType =
    | "unknownError"
    | "failedToFetchParcels"
    | "abortedFetch";

export interface CollectionCentresOptions {
    name: string;
    acronym: string;
}
export interface StatusResponseRow {
    event_name: string;
}

export type ParcelStatusesError = "failedToFetchStatuses";
export type ParcelStatusesReturnType =
    | {
          data: ParcelStatus[];
          error: null;
      }
    | {
          data: null;
          error: { type: ParcelStatusesError; logId: string };
      };

export type DbParcelRow = ViewSchema["parcels_plus"];
export type ParcelsFilterMethod<State = any> = ServerSideFilterMethod<DbParcelRow, State>;
export type ParcelsFilter<State = any> = ServerSideFilter<ParcelsTableRow, State, DbParcelRow>;
export type ParcelsSortMethod = ServerSideSortMethod<DbParcelRow>;
export type ParcelsSortState = SortState<ParcelsTableRow, ParcelsSortMethod>;

export type CongestionChargeDetails = {
    postcode: string;
    congestionCharge: boolean;
};

export type GetDbParcelDataResult =
    | {
          parcels: ParcelsPlusRow[];
          error: null;
      }
    | {
          parcels: null;
          error: {
              type: GetDbParcelDataErrorType;
              logId: string;
          };
      };

export type GetDbParcelDataErrorType = "abortedFetch" | "failedToFetchParcelTable";

export interface packingSlotOptionsSet {
    key: string;
    value: string;
}

type FetchClientIdErrorType = "failedClientIdFetch";
export interface FetchClientIdError {
    type: FetchClientIdErrorType;
    logId: string;
}

export type FetchClientIdResult =
    | {
          clientId: string;
          error: null;
      }
    | {
          clientId: null;
          error: FetchClientIdError;
      };