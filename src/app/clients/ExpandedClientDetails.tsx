import React from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import getExpandedClientDetails from "@/app/clients/getExpandedClientDetails";

interface Props {
    parcelId: string | null;
}

const ExpandedClientDetails = async ({ parcelId }: Props): Promise<React.ReactElement> => {
    if (!parcelId) {
        return <></>;
    }
    const expandedClientDetails = await getExpandedClientDetails(parcelId);

    return <DataViewer data={expandedClientDetails} />;
};

export default ExpandedClientDetails;
