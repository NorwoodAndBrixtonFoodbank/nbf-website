import { CongestionChargeDetails, ProcessingData } from "@/app/clients/fetchDataFromServer";
import {
    ParcelsTableRow,
    datetimeToPackingTimeLabel,
    eventToLastStatus,
    processingDataToClientsTableData,
} from "@/app/clients/getClientsTableData";
import {
    familyCountToFamilyCategory,
    formatAddressFromClientDetails,
    formatBreakdownOfChildrenFromFamilyDetails,
    formatDatetimeAsDate,
    formatDatetimeAsTime,
    formatHouseholdFromFamilyDetails,
    rawDataToExpandedClientDetails,
    RawClientDetails,
} from "@/app/clients/getExpandedClientDetails";

const sampleProcessingData: ProcessingData = [
    {
        parcel_id: "PRIMARY_KEY1",
        collection_centre: "COLLECTION_CENTRE",
        collection_datetime: "2023-08-04T13:30:00+00:00",
        packing_datetime: "2023-08-04T13:30:00+00:00",
        voucher_number: "VOUCHER_1",

        client: {
            primary_key: "PRIMARY_KEY2",
            full_name: "CLIENT_NAME",
            address_postcode: "SW1A 2AA",
            flagged_for_attention: false,
            signposting_call_required: true,

            family: [
                { age: 36, gender: "female" },
                { age: 5, gender: "male" },
                { age: 24, gender: "other" },
            ],
        },

        events: [
            {
                event_name: "LAST_EVENT",
                timestamp: "2023-08-04T13:30:00+00:00",
            },
        ],
    },
];

const sampleCongestionChargeData: CongestionChargeDetails[] = [
    {
        postcode: "SW1A 2AA",
        congestionCharge: true,
    },
];

const sampleRawExpandedClientDetails: RawClientDetails = {
    voucher_number: "VOUCHER_1",
    packing_datetime: "2023-08-04T13:30:00+00:00",

    client: {
        primary_key: "PRIMARY_KEY_1",
        full_name: "CLIENT NAME",
        phone_number: "PHONE NUMBER",
        delivery_instructions: "INSTRUCTIONS FOR DELIVERY",
        address_1: "Address Line 1",
        address_2: "Address Line 2",
        address_town: "TOWN",
        address_county: "",
        address_postcode: "SW1A 2AA",

        family: [
            { age: 36, gender: "female" },
            { age: 5, gender: "male" },
            { age: 24, gender: "other" },
        ],

        dietary_requirements: ["Gluten Free", "Halal", "No Pasta"],
        feminine_products: ["Tampons", "Incontinence Pads"],
        baby_food: true,
        pet_food: ["Cat", "Dog"],
        other_items: ["Garlic", "Chillies", "Hot Water Bottles"],
        extra_information: "EXTRA CLIENT INFORMATION",
    },
};

describe("Clients Page", () => {
    describe("Backend Processing for Table Data", () => {
        it("Fields are set correctly", () => {
            cy.intercept("POST", "**/check-congestion-charge", (req) => {
                const response = req.body.postcodes.map((postcode: string) => ({
                    postcode,
                    congestionCharge: true,
                }));

                req.reply(JSON.stringify(response));
            });

            const result = processingDataToClientsTableData(
                sampleProcessingData,
                sampleCongestionChargeData
            );

            const expected: ParcelsTableRow[] = [
                {
                    parcelId: "PRIMARY_KEY1",
                    primaryKey: "PRIMARY_KEY2",
                    fullName: "CLIENT_NAME",
                    familyCategory: "Family of 3",
                    addressPostcode: "SW1A 2AA",
                    collectionDatetime: new Date("2023-08-04T13:30:00+00:00"),
                    deliveryCollection: {
                        collectionCentre: "COLLECTION_CENTRE",
                        congestionChargeApplies: true,
                    },
                    packingTimeLabel: "PM",
                    lastStatus: {
                        name: "LAST_EVENT",
                        timestamp: new Date("2023-08-04T13:30:00+00:00"),
                    },
                    voucherNumber: "VOUCHER_1",
                    packingDatetime: new Date("2023-08-04T13:30:00+00:00"),
                    iconsColumn: {
                        flaggedForAttention: false,
                        requiresFollowUpPhoneCall: true,
                    },
                },
            ];
            expect(result).to.deep.equal(expected);
        });

        it("familyCountToFamilyCategory()", () => {
            expect(familyCountToFamilyCategory(1)).to.eq("Single");
            expect(familyCountToFamilyCategory(2)).to.eq("Family of 2");
            expect(familyCountToFamilyCategory(9)).to.eq("Family of 9");
            expect(familyCountToFamilyCategory(10)).to.eq("Family of 10+");
            expect(familyCountToFamilyCategory(15)).to.eq("Family of 10+");
        });

        it("formatDatetimeAsDate()", () => {
            expect(formatDatetimeAsDate("2023-08-04T13:30:00+00:00")).to.eq("04/08/2023");
            expect(formatDatetimeAsDate("2024-11-23T01:43:50+00:00")).to.eq("23/11/2024");
            expect(formatDatetimeAsDate("Invalid_Date_Format")).to.eq("-");
            expect(formatDatetimeAsDate(null)).to.eq("-");
        });

        it("datetimeToPackingTimeLabel()", () => {
            expect(datetimeToPackingTimeLabel("2023-08-04T08:30:00+00:00")).to.eq("AM");
            expect(datetimeToPackingTimeLabel("2023-08-04T13:30:00+00:00")).to.eq("PM");
        });

        it("eventToStatusMessage()", () => {
            expect(
                eventToLastStatus({
                    event_name: "EVENT",
                    timestamp: "2023-08-04T13:30:00+00:00",
                })
            ).to.deep.eq({
                name: "EVENT",
                timestamp: new Date("2023-08-04T13:30:00+00:00"),
            });
            expect(eventToLastStatus(null)).to.eq(null);
        });
    });

    describe("Backend Processing for Expanded Client Details", () => {
        it("Fields are set correctly", () => {
            const expandedClientDetails = rawDataToExpandedClientDetails(
                sampleRawExpandedClientDetails
            );

            const expectedTime = new Date("2023-08-04T13:30:00+00:00").toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            });

            expect(expandedClientDetails).to.deep.equal({
                "voucher_#": "VOUCHER_1",
                full_name: "CLIENT NAME",
                phone_number: "PHONE NUMBER",
                packing_date: "04/08/2023",
                packing_time: expectedTime,
                delivery_instructions: "INSTRUCTIONS FOR DELIVERY",
                address: "Address Line 1, Address Line 2, TOWN, SW1A 2AA",
                household: "Family of 3 Occupants (2 adults, 1 child)",
                "age_&_gender_of_children": "5-year-old male",
                dietary_requirements: "Gluten Free, Halal, No Pasta",
                feminine_products: "Tampons, Incontinence Pads",
                baby_products: true,
                pet_food: "Cat, Dog",
                other_requirements: "Garlic, Chillies, Hot Water Bottles",
                extra_information: "EXTRA CLIENT INFORMATION",
            });
        });

        it("formatDatetimeAsTime()", () => {
            expect(formatDatetimeAsTime("2023-08-04T13:30:02+00:00")).to.eq(
                new Date("2023-08-04T13:30:02+00:00").toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
            expect(formatDatetimeAsTime("Invalid_Time_Format")).to.eq("-");
            expect(formatDatetimeAsTime(null)).to.eq("-");
        });

        it("formatAddressFromClientDetails()", () => {
            expect(
                formatAddressFromClientDetails({
                    address_1: "Address Line 1",
                    address_2: "Address Line 2",
                    address_town: "TOWN",
                    address_county: "COUNTY",
                    address_postcode: "POSTCODE",
                })
            ).to.eq("Address Line 1, Address Line 2, TOWN, COUNTY, POSTCODE");

            expect(
                formatAddressFromClientDetails({
                    address_1: "Address Line 1",
                    address_2: "",
                    address_town: "TOWN",
                    address_county: "",
                    address_postcode: "POSTCODE",
                })
            ).to.eq("Address Line 1, TOWN, POSTCODE");
        });

        it("formatHouseholdFromFamilyDetails()", () => {
            expect(
                formatHouseholdFromFamilyDetails([
                    { age: 36, gender: "female" },
                    { age: 5, gender: "male" },
                    { age: 24, gender: "other" },
                ])
            ).to.eq("Family of 3 Occupants (2 adults, 1 child)");

            expect(
                formatHouseholdFromFamilyDetails([
                    { age: 36, gender: "female" },
                    { age: 5, gender: "male" },
                    { age: 4, gender: "female" },
                    { age: 15, gender: "other" },
                ])
            ).to.eq("Family of 4 Occupants (1 adult, 3 children)");

            expect(formatHouseholdFromFamilyDetails([{ age: 16, gender: "female" }])).to.eq(
                "Single Occupant (1 adult)"
            );

            expect(formatHouseholdFromFamilyDetails([{ age: 15, gender: "male" }])).to.eq(
                "Single Occupant (1 child)"
            );
        });

        it("formatBreakdownOfChildrenFromFamilyDetails()", () => {
            expect(
                formatBreakdownOfChildrenFromFamilyDetails([
                    { age: 36, gender: "female" },
                    { age: 5, gender: "male" },
                    { age: 4, gender: "female" },
                    { age: 15, gender: "other" },
                ])
            ).to.eq("5-year-old male, 4-year-old female, 15-year-old other");

            expect(
                formatBreakdownOfChildrenFromFamilyDetails([
                    { age: 36, gender: "female" },
                    { age: 15, gender: "female" },
                ])
            ).to.eq("15-year-old female");

            expect(
                formatBreakdownOfChildrenFromFamilyDetails([
                    { age: 36, gender: "female" },
                    { age: 26, gender: "male" },
                ])
            ).to.eq("No Children");
        });
    });
});
