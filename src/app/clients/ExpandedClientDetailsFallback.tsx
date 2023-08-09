import React from "react";
import DataViewerFallback from "@/components/DataViewer/DataViewerFallback";

const clientDetailFields = [
    "VOUCHER #",
    "FULL NAME",
    "PHONE NUMBER",
    "PACKING DATE",
    "PACKING TIME",
    "DELIVERY_INSTRUCTIONS",
    "ADDRESS",
    "HOUSEHOLD",
    "AGE & GENDER OF CHILDREN",
    "DIETARY REQUIREMENTS",
    "FEMININE PRODUCTS",
    "BABY PRODUCTS",
    "PET FOOD",
    "OTHER REQUIREMENTS",
    "EXTRA INFORMATION",
];

const ExpandedClientDetailsFallback: React.FC<{}> = () => {
    return <DataViewerFallback fieldPlaceholders={clientDetailFields} />;
};

export default ExpandedClientDetailsFallback;
