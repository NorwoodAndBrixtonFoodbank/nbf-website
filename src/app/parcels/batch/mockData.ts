import { Schema } from "@/databaseUtils";
import { BatchTableDataState } from "@/app/parcels/batch/batchTypes";
import dayjs from "dayjs";
import { emptyBatchEditData, emptyOverrideData } from "@/app/parcels/batch/emptyData";

export const mockTableDataState: BatchTableDataState = {
    overrideDataRow: { data: emptyOverrideData },
    batchDataRows: [
        {
            id: 1,
            clientId: "1",
            data: {
                client: {
                    fullName: "John Doe",
                    phoneNumber: "0123456789",
                    address: {
                        addressLine1: "123 Main St",
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
                parcel: emptyBatchEditData.parcel,
            },
        },
        {
            id: 2,
            clientId: "2",
            data: {
                client: {
                    fullName: "Jane Smiths",
                    phoneNumber: "9876543210",
                    address: {
                        addressLine1: "456 Elm St",
                        addressLine2: null,
                        addressTown: "Anytown",
                        addressCounty: "USA",
                        addressPostcode: "54321",
                    },
                    adultInfo: {
                        adults: [],
                        numberOfAdults: 0,
                    },
                    childrenInfo: {
                        children: [],
                        numberOfChildren: 0,
                    },
                    listType: "regular",
                    dietaryRequirements: { "gluten-free": true },
                    feminineProducts: { tampons: true, pads: false },
                    babyProducts: "No",
                    nappySize: null,
                    petFood: { cat: true, dog: false },
                    otherItems: { toothpaste: false, toothbrush: false },
                    deliveryInstructions: "Leave at 12 pm",
                    extraInformation: "No special requests",
                    attentionFlag: false,
                    signpostingCall: true,
                    notes: null,
                },
                clientReadOnly: false,
                parcel: emptyBatchEditData.parcel,
            },
        },
    ],
    clientOverrides: [],
    parcelOverrides: [],
};

export const mockExistingClientRow: Schema["clients"] = {
    primary_key: "dcb54bc0-b0d3-57fa-bf9b-f1c4da6931a9",
    full_name: "Test Person",
    phone_number: "+140969525594300",
    address_1: "3454 Test St",
    address_2: null,
    address_town: "Test Town",
    address_county: "Test County",
    address_postcode: "TE5T 1NG",
    delivery_instructions: "Leave at the door",
    family_id: "family-test-id",
    dietary_requirements: ["vegan"],
    feminine_products: ["tampons"],
    baby_food: false,
    pet_food: ["dog"],
    other_items: ["toothpaste"],
    extra_information: "No special requests",
    flagged_for_attention: false,
    signposting_call_required: true,
    last_updated: "2022-01-01",
    is_active: true,
    notes: null,
    default_list: "regular",
};

const currentYear = dayjs().year();
const currentMonth = dayjs().month();

export const mockExistingFamily: Schema["families"][] = [
    {
        primary_key: "test-dad",
        family_id: "family-test-id",
        gender: "male",
        birth_month: null,
        birth_year: 1980,
    },
    {
        primary_key: "test-mum",
        family_id: "family-test-id",
        gender: "female",
        birth_month: null,
        birth_year: 1985,
    },
    {
        primary_key: "test-adult-child",
        family_id: "family-test-id",
        gender: "female",
        birth_month: currentMonth,
        birth_year: currentYear - 16,
    },
    {
        primary_key: "test-child-child",
        family_id: "family-test-id",
        gender: "female",
        birth_month: currentMonth,
        birth_year: currentYear - 15,
    },
];

export const mockExistingClientRowWithNappySize: Schema["clients"] = {
    primary_key: "44d14896-357b-5e91-ab64-2ca95b6a2faa",
    full_name: "Test Nappy Person",
    phone_number: "+661129414051390",
    address_1: "3454 Nappy St",
    address_2: null,
    address_town: "Nappy Town",
    address_county: "Nappy County",
    address_postcode: "N4P 9YS",
    delivery_instructions: "Leave Nappies at the door",
    family_id: "nappy-family-test-id",
    dietary_requirements: ["vegan"],
    feminine_products: ["tampons"],
    baby_food: true,
    pet_food: ["dog"],
    other_items: ["toothpaste"],
    extra_information: "Nappy Size: 10, Extra Information: I love nappies",
    flagged_for_attention: false,
    signposting_call_required: true,
    last_updated: "2022-01-01",
    is_active: true,
    notes: null,
    default_list: "regular",
};

export const mockExistingNappyFamily: Schema["families"][] = [
    {
        primary_key: "test-nappy-dad",
        family_id: "nappy-family-test-id",
        gender: "male",
        birth_month: null,
        birth_year: 1980,
    },
    {
        primary_key: "test-nappy-baby",
        family_id: "nappy-family-test-id",
        gender: "female",
        birth_month: null,
        birth_year: currentYear - 2,
    },
];
