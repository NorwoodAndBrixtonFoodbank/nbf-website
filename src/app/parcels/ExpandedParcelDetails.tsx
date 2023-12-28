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
    const expandedParcelDetails = await getExpandedParcelDetails(parcelId);

    return <DataViewer data={expandedParcelDetails} />;
};

export default ExpandedParcelDetails;
