// TODO: VFB-64
// import React from "react";
// import PdfButton from "@/components/PdfButton/PdfButton";
// import ShoppingListPdf from "@/pdf/ShoppingList/ShoppingListPdf";
// import { ShoppingListPdfDataList } from "@/pdf/ShoppingList/shoppingListPdfDataProps";

// const downloadsFolder = Cypress.config("downloadsFolder");
// const fileName = "ShoppingLists.pdf";

// const dataForShoppingListParcels: ShoppingListPdfDataList = {
//     lists: [
//         {
//             postcode: "NE5 5IE",
//             parcelInfo: {
//                 voucherNumber: "random-vchr-num",
//                 packingDate: "01/07/2023, 09:00",
//                 collectionDate: "01/07/2023, 14:00",
//                 collectionSite: "Magic Collection Centre",
//             },
//             clientSummary: {
//                 name: "Nessie Loch",
//                 contact: "0799999999",
//                 address: "Loch Ness\nScottish Highlands\nNE5 5IE",
//                 extraInformation: "",
//             },
//             householdSummary: {
//                 householdSize: "1 Adult 0 Children",
//                 genderBreakdown: "0 Female 1 Male",
//                 numberOfBabies: "0",
//                 ageAndGenderOfChildren: "",
//             },
//             requirementSummary: {
//                 feminineProductsRequired: "None",
//                 babyProductsRequired: "No",
//                 petFoodRequired: "None",
//                 dietaryRequirements: "None",
//                 otherItems: "Chillies, Hot Water Bottle",
//             },
//             itemsList: [
//                 {
//                     description: "Savoury Snacks (Crisps etc)",
//                     quantity: "3 individual or 1 packet",
//                     notes: "",
//                 },
//                 {
//                     description: "Instant Noodles / Pasta",
//                     quantity: "2",
//                     notes: "Any single instant pasta or noodles, not rice",
//                 },
//             ],
//             endNotes: "Space is valuable! Please don't leave boxes half empty - pack efficiently",
//         },
//         {
//             postcode: "YE1 1OW",
//             parcelInfo: {
//                 voucherNumber: "some-vchr-num",
//                 packingDate: "24/06/2023, 14:30",
//                 collectionDate: "24/06/2023, 16:30",
//                 collectionSite: "Delivery",
//             },
//             clientSummary: {
//                 name: "Harry Potter",
//                 contact: "07987654321",
//                 address: "Hogwarts Castle\nThree Quarters Town\nDumbartonshire\nYE1 1OW",
//                 extraInformation: "Owl food needed",
//             },
//             householdSummary: {
//                 householdSize: "2 Adults 1 Child",
//                 genderBreakdown: "2 Female 1 Male 0 Other",
//                 numberOfBabies: "0",
//                 ageAndGenderOfChildren: "8 M",
//             },
//             requirementSummary: {
//                 feminineProductsRequired: "Tampons, Pads",
//                 babyProductsRequired: "No",
//                 petFoodRequired: "None",
//                 dietaryRequirements: "Gluten free, Diabetic",
//                 otherItems: "Spices, Ginger, Blankets",
//             },
//             itemsList: [
//                 {
//                     description: "Washing Up Liquid",
//                     quantity: "1 decanted bottle",
//                     notes: "Only use decanted, please don't use full bottle",
//                 },
//                 {
//                     description: "Tinned Tomatoes",
//                     quantity: "2",
//                     notes: "",
//                 },
//             ],
//             endNotes: "Space is valuable! Please don't leave boxes half empty - pack efficiently",
//         },
//     ],
// };

// const getFieldValuesFromObject = (obj: object): string[] => {
//     return Object.values(obj)
//         .map((field) => {
//             if (typeof field === "object") {
//                 return getFieldValuesFromObject(field);
//             }
//             return String(field);
//         })
//         .flat();
// };

// const allFields = dataForShoppingListParcels.lists
//     .map((obj) => {
//         return getFieldValuesFromObject(obj);
//     })
//     .flat();

// console.dir(allFields);

// describe("Export Pdf Button", () => {
//     beforeEach(() => {
//         cy.mount(
//             <PdfButton
//                 text="Click"
//                 fileName={fileName}
//                 data={dataForShoppingListParcels}
//                 pdfComponent={ShoppingListPdf}
//                 formatName={false}
//             />
//         );
//     });

//     it("Renders", () => {});

//     it("File is saved", () => {
//         // eslint-disable-next-line quotes
//         cy.get('a[download="' + fileName + '"]').click();
//         cy.readFile(`${downloadsFolder}/${fileName}`);
//     });

//     it("All data of shipping label is included in the file", () => {
//         cy.get("a").click();
//         for (const field of allFields) {
//             cy.task("readPdf", `${downloadsFolder}/${fileName}`).should("contain", field);
//         }
//     });
// });
