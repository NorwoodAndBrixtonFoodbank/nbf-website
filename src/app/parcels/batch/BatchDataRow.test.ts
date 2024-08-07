import { init } from "next/dist/compiled/webpack/webpack";
import { BatchActionType, reducer } from "./BatchDataRow";
import { mockTableDataState } from "./mockData";
import { expect, it } from "@jest/globals";

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

    it("should autofill for an exisiting client", async () => {});
});
