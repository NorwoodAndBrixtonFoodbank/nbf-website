import { BatchActionType, reducer } from "@/app/parcels/batch/BatchDataRow";
import {
    mockExistingClientRow,
    mockExistingClientRowWithNappySize,
    mockExistingFamily,
    mockExistingNappyFamily,
    mockTableDataState,
} from "@/app/parcels/batch/mockData";
import { expect, it } from "@jest/globals";

jest.mock("@/app/parcels/batch/supabaseCalls", () => ({
    getClientSupabaseCall: jest.fn((clientId: string) =>
        clientId === "dcb54bc0-b0d3-57fa-bf9b-f1c4da6931a9"
            ? {
                  data: mockExistingClientRow,
                  error: null,
              }
            : {
                  data: mockExistingClientRowWithNappySize,
                  error: null,
              }
    ),
    getFamilySupabaseCall: jest.fn((familyId: string) =>
        familyId === "family-test-id"
            ? {
                  data: mockExistingFamily,
                  error: null,
              }
            : {
                  data: mockExistingNappyFamily,
                  error: null,
              }
    ),
}));

const logID = "a2adb0ba-873e-506b-abd1-8cd1782923c8";
jest.mock("@/logger/logger", () => ({
    logErrorReturnLogId: jest.fn(() => Promise.resolve(logID)),
}));

describe("reducer", () => {
    it("should update a cell in the batch data", async () => {
        const action: BatchActionType = {
            type: "update_cell",
            payload: {
                rowId: mockTableDataState.batchDataRows[0].id,
                newRow: {
                    id: mockTableDataState.batchDataRows[0].id,
                    clientId: "1",
                    data: {
                        client: {
                            fullName: "John Doe",
                            phoneNumber: "0123456789",
                            address: {
                                addressLine1: "123 New Street",
                                addressLine2: null,
                                addressTown: "Anytown",
                                addressCounty: "USA",
                                addressPostcode: "12345",
                            },
                            adultInfo: {
                                adults: [],
                                numberOfAdults: 0,
                            },
                            childrenInfo: {
                                children: [],
                                numberOfChildren: 0,
                            },
                            listType: "hotel",
                            dietaryRequirements: { vegan: true },
                            feminineProducts: { tampons: false, pads: false },
                            babyProducts: null,
                            nappySize: null,
                            petFood: { cat: false, dog: false },
                            otherItems: { toothpaste: false, toothbrush: false },
                            deliveryInstructions: "Leave at 10 am",
                            extraInformation: "No special requests",
                            attentionFlag: true,
                            signpostingCall: false,
                            notes: null,
                        },
                        clientReadOnly: false,
                        parcel: null,
                    },
                },
            },
        };
        const newState = await reducer(mockTableDataState, action);
        expect(newState.batchDataRows[0].data?.client.address.addressLine1).toEqual(
            "123 New Street"
        );
        expect(newState.batchDataRows[0].data?.client.fullName).toEqual("John Doe");
    });
    it("should add a new row to the batch data", async () => {
        const action: BatchActionType = {
            type: "add_row",
        };

        const newState = await reducer(mockTableDataState, action);

        expect(newState.batchDataRows.length).toBe(3);
        expect(newState.batchDataRows[2].id).toBe(3);
        expect(newState.batchDataRows[2].data?.client.fullName).toBe(undefined);
    });

    it("should delete a row from the batch data", async () => {
        const action: BatchActionType = {
            type: "delete_row",
            payload: {
                rowId: 1,
            },
        };

        const newState = await reducer(mockTableDataState, action);

        expect(newState.batchDataRows.length).toBe(1);
        expect(newState.batchDataRows[0].data?.client.fullName).toBe("Jane Smiths");
    });

    it("should override a column in the override data", async () => {
        const action: BatchActionType = {
            type: "override_column",
            payload: {
                newOverrideRow: {
                    data: {
                        client: {
                            fullName: null,
                            phoneNumber: null,
                            address: {
                                addressLine1: "new group address",
                                addressLine2: null,
                                addressTown: "Anytown",
                                addressCounty: "USA",
                                addressPostcode: "12345",
                            },
                            adultInfo: null,
                            childrenInfo: null,
                            listType: null,
                            dietaryRequirements: null,
                            feminineProducts: null,
                            babyProducts: null,
                            nappySize: null,
                            petFood: null,
                            otherItems: null,
                            deliveryInstructions: null,
                            extraInformation: null,
                            attentionFlag: null,
                            signpostingCall: null,
                            notes: null,
                        },
                        parcel: {
                            voucherNumber: null,
                            packingDate: null,
                            packingSlot: null,
                            shippingMethod: null,
                            collectionInfo: null,
                        },
                    },
                },
            },
        };

        const newState = await reducer(mockTableDataState, action);

        expect(newState.batchDataRows[0].data?.client.address.addressLine1).toBe(
            "new group address"
        );
        expect(newState.batchDataRows[1].data?.client.address.addressLine1).toBe(
            "new group address"
        );
    });

    it("should autofill for an exisiting client and format result correctly", async () => {
        const actionAddRow: BatchActionType = {
            type: "add_row",
        };

        const lastRowEmptyState1 = await reducer(mockTableDataState, actionAddRow);

        const actionUseExistingClient: BatchActionType = {
            type: "use_existing_client",
            payload: {
                rowId: 3,
                existingClientId: "dcb54bc0-b0d3-57fa-bf9b-f1c4da6931a9",
            },
        };
        const existingClientState = await reducer(lastRowEmptyState1, actionUseExistingClient);
        expect(existingClientState.batchDataRows[2].data?.client.fullName).toBe("Test Person");
        expect(existingClientState.batchDataRows[2].data?.client.address).toStrictEqual({
            addressLine1: "3454 Test St",
            addressLine2: "",
            addressTown: "Test Town",
            addressCounty: "Test County",
            addressPostcode: "TE5T 1NG",
        });
        expect(existingClientState.batchDataRows[2].data?.client.adultInfo).toStrictEqual({
            adults: [
                { gender: "male", birthYear: 1980, birthMonth: null },
                { gender: "female", birthYear: 1985, birthMonth: null },
                { gender: "female", birthYear: 2008, birthMonth: 7 },
            ],
            numberOfAdults: 3,
        });

        const lastRowEmptyState2 = await reducer(existingClientState, actionAddRow);

        const actionUseExistingNappyClient: BatchActionType = {
            type: "use_existing_client",
            payload: {
                rowId: 4,
                existingClientId: "44d14896-357b-5e91-ab64-2ca95b6a2faa",
            },
        };

        const existingNappyClientState = await reducer(
            lastRowEmptyState2,
            actionUseExistingNappyClient
        );
        expect(existingNappyClientState.batchDataRows[3].data?.client.fullName).toBe(
            "Test Nappy Person"
        );
        expect(existingNappyClientState.batchDataRows[3].data?.client.nappySize).toBe("10");
        expect(existingNappyClientState.batchDataRows[3].data?.client.extraInformation).toBe(
            "I love nappies"
        );
        expect(existingNappyClientState.batchDataRows[3].data?.client.adultInfo).toStrictEqual({
            adults: [{ gender: "male", birthYear: 1980, birthMonth: null }],
            numberOfAdults: 1,
        });
    });
});
