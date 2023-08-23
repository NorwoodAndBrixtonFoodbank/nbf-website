import React from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import getExpandedParcelDetails from "@/app/parcels/getExpandedParcelDetails";

interface Props {
    parcelId: string | null;
}

const ExpandedParcelDetails = async ({ parcelId }: Props): Promise<React.ReactElement> => {
    if (!parcelId) {
        return <></>;
    }
    const expandedClientDetails = await getExpandedParcelDetails(parcelId);

    return <DataViewer data={expandedClientDetails} />;
};

export default ExpandedParcelDetails;
