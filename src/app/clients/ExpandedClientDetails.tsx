"use client";

import React, { useEffect, useState } from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import DataViewerFallback from "@/components/DataViewer/DataViewerFallback";
import {
    getExpandedClientDetails,
    ExpandedClientDetails,
} from "@/app/clients/getExpandedClientDetails";

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

interface Props {
    parcelId: string | null;
}

const ExpandedClientDetails: React.FC<Props> = (props) => {
    const [expandedClientDetails, setExpandedClientDetails] =
        useState<ExpandedClientDetails | null>(null);

    useEffect(() => {
        async function getAndSetClientDetails() {
            if (props.parcelId === null) {
                return;
            }

            const clientDetailsResponse = await getExpandedClientDetails(props.parcelId);
            setExpandedClientDetails(clientDetailsResponse);
        }
        getAndSetClientDetails();
    }, []);

    if (expandedClientDetails === null) {
        if (props.parcelId === null) {
            return <></>;
        }
        return <DataViewerFallback fieldPlaceholders={clientDetailFields} />;
    }

    return <DataViewer data={expandedClientDetails} />;
};

export default ExpandedClientDetails;
