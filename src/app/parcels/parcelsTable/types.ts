import { Filter } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
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
export type ParcelsFilter<state = any> = Filter<ParcelsTableRow, state, DbParcelRow>;
export type ParcelsSortState = SortState<ParcelsTableRow, DbParcelRow>;

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
