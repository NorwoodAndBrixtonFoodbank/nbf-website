import { CongestionChargeDetails, ParcelProcessingData } from "@/app/parcels/fetchParcelTableData";
import {
    ParcelsTableRow,
    datetimeToPackingTimeLabel,
    processLastStatus,
    processingDataToParcelsTableData,
} from "@/app/parcels/getParcelsTableData";
import {
    familyCountToFamilyCategory,
    formatAddressFromClientDetails,
    formatBreakdownOfChildrenFromFamilyDetails,
    formatDatetimeAsDate,
    formatDatetimeAsTime,
    formatHouseholdFromFamilyDetails,
    processEventsDetails,
    rawDataToExpandedParcelData,
    RawParcelDetails,
} from "@/app/parcels/getExpandedParcelDetails";

const sampleProcessingData: ParcelProcessingData = [
    {
        parcel_id: "PRIMARY_KEY",
        collection_centre_name: "COLLECTION_CENTRE",
        collection_centre_acronym: "CC",
        collection_datetime: "2023-08-04T13:30:00+00:00",
        packing_date: "2023-08-04T13:30:00+00:00",
        packing_slot_name: "AM",
        voucher_number: "VOUCHER_1",
        client_id: "PRIMARY_KEY2",
        client_full_name: "CLIENT_NAME",
        client_address_postcode: "SW1A 2AA",
        client_phone_number: "08642 123",
        client_flagged_for_attention: false,
        client_signposting_call_required: true,
        family_count: 3,
        last_status_event_name: "LAST_EVENT",
        last_status_event_data: "SOME_RELATED_DATA",
        last_status_timestamp: "2023-08-04T13:30:00+00:00",
        last_status_workflow_order: 1,
    },
];

const sampleCongestionChargeData: CongestionChargeDetails[] = [
    {
        postcode: "SW1A 2AA",
        congestionCharge: true,
    },
];

const sampleRawExpandedClientDetails: RawParcelDetails = {
    voucher_number: "VOUCHER_1",
    packing_date: "2023-08-04T13:30:00+00:00",
    packing_slot: { name: "AM" },
    collection_centre: {
        name: "A COLLECTION CENTRE",
    },

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
    },

    events: [
        { event_name: "Event 1", timestamp: "2023-06-04T13:30:00+00:00", event_data: "" },
        {
            event_name: "Event 2",
            timestamp: "2023-06-04T13:30:00+00:00",
            event_data: "Something happened",
        },
    ],
};

describe("Parcels Page", () => {
    describe("Backend Processing for Table Data", () => {
        it("Fields are set correctly", () => {
            const result = processingDataToParcelsTableData(
                sampleProcessingData,
                sampleCongestionChargeData
            );

            const expected: ParcelsTableRow[] = [
                {
                    parcelId: "PRIMARY_KEY",
                    clientId: "PRIMARY_KEY2",
                    fullName: "CLIENT_NAME",
                    familyCategory: "Family of 3",
                    addressPostcode: "SW1A 2AA",
                    phoneNumber: "08642 123",
                    collectionDatetime: new Date("2023-08-04T13:30:00+00:00"),
                    deliveryCollection: {
                        collectionCentreName: "COLLECTION_CENTRE",
                        collectionCentreAcronym: "CC",
                        congestionChargeApplies: true,
                    },
                    packingSlot: "PM",
                    lastStatus: {
                        name: "LAST_EVENT",
                        eventData: "SOME_RELATED_DATA",
                        timestamp: new Date("2023-08-04T13:30:00+00:00"),
                        workflowOrder: 1,
                    },
                    voucherNumber: "VOUCHER_1",
                    packingDate: new Date("2023-08-04T13:30:00+00:00"),
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
                processLastStatus({
                    last_status_event_name: "EVENT",
                    last_status_event_data: "SOME_RELATED_DATA",
                    last_status_timestamp: "2023-08-04T13:30:00+00:00",
                    last_status_workflow_order: 1,
                })
            ).to.deep.eq({
                name: "EVENT",
                eventData: "SOME_RELATED_DATA",
                timestamp: new Date("2023-08-04T13:30:00+00:00"),
                workflowOrder: 1,
            });
            expect(processLastStatus(null)).to.eq(null);
        });
    });

    describe("Backend Processing for Expanded Parcel Details", () => {
        it("Fields are set correctly", () => {
            const expandedClientDetails = rawDataToExpandedParcelData(
                sampleRawExpandedClientDetails
            );

            const expectedTime = new Date("2023-08-04T13:30:00+00:00").toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            });

            expect(expandedClientDetails).to.deep.equal({
                voucherNumber: "VOUCHER_1",
                fullName: "CLIENT NAME",
                address: "Address Line 1, Address Line 2, TOWN, SW1A 2AA",
                deliveryInstructions: "INSTRUCTIONS FOR DELIVERY",
                phoneNumber: "PHONE NUMBER",
                household: "Family of 3 Occupants (2 adults, 1 child)",
                children: "5-year-old male",
                packingDate: "04/08/2023",
                packingTime: expectedTime,
                collection: "A COLLECTION CENTRE",
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

        it("processEventsDetails()", () => {
            expect(
                processEventsDetails([
                    {
                        event_name: "Event 1",
                        timestamp: "2023-08-04T13:30:00+00:00",
                        event_data: "",
                    },
                    {
                        event_name: "Event 2",
                        timestamp: "2023-06-04T15:30:00+00:00",
                        event_data: "Message",
                    },
                ])
            ).to.deep.eq([
                { eventInfo: "Event 1", timestamp: new Date("2023-08-04T13:30:00+00:00") },
                {
                    eventInfo: "Event 2 (Message)",
                    timestamp: new Date("2023-06-04T15:30:00+00:00"),
                },
            ]);
        });
    });
});
