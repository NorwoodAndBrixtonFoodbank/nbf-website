import React from "react";
import DataViewerFallback from "@/components/DataViewer/DataViewerFallback";

const clientDetailFields = [
    "VOUCHER #",
    "FULL NAME",
    "ADDRESS",
    "PHONE NUMBER",
    "DELIVERY_INSTRUCTIONS",
    "HOUSEHOLD",
    "CHILDREN",
    "PACKING DATE",
    "PACKING TIME",
    "COLLECTION",
];

const ExpandedParcelDetailsFallback: React.FC<{}> = () => {
    return <DataViewerFallback fieldPlaceholders={clientDetailFields} />;
};

export default ExpandedParcelDetailsFallback;
