import { getRawClientDetails } from "@/app/clients/fetchDataFromServer";
import React from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import { rawDataToExpandedClientDetails } from "@/app/clients/getExpandedClientDetails";

interface Props {
    parcelId: string | null;
}

const ExpandedClientDetails = async ({ parcelId }: Props): Promise<React.ReactElement> => {
    if (!parcelId) {
        return <></>;
    }

    const rawDetails = await getRawClientDetails(parcelId);
    const expandedClientDetails = rawDataToExpandedClientDetails(rawDetails);

    return <DataViewer data={expandedClientDetails} />;
};

export default ExpandedClientDetails;
