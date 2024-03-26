import {
    ExpandedClientParcelDetails,
    ParcelsDetail,
    rawDataToClientParcelsDetails,
} from "@/app/clients/getClientParcelsData";

const sampleParcelData: ParcelsDetail = {
    parcel_id: "a2adb0ba-873e-506b-abd1-8cd1782923c8",
    collection_centre: {
        name: "Clapham - St Stephens Church",
    },
    packing_date: "2024-09-24 17:31:25.437+00",
    voucher_number: "Sum et non es etiam.",
};

const sampleExpandedClientParcelDetails: ExpandedClientParcelDetails = {
    parcelId: "a2adb0ba-873e-506b-abd1-8cd1782923c8",
    voucherNumber: "Sum et non es etiam.",
    packingDate: "24/09/2024",
    collectionCentre: "Clapham - St Stephens Church",
};

describe("getClientParcelsData", () => {
    it("Should format the data correctly", () => {
        const result = rawDataToClientParcelsDetails(sampleParcelData);
        expect(result).to.deep.equal(sampleExpandedClientParcelDetails);
    });
});
