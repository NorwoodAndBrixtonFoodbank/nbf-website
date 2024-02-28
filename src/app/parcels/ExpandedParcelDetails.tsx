import React from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import getExpandedParcelDetails from "@/app/parcels/getExpandedParcelDetails";
import EventTable from "./EventTable";

interface Props {
    parcelId: string | null;
}

const ExpandedParcelDetails = async ({ parcelId }: Props): Promise<React.ReactElement> => {
    if (!parcelId) {
        return <></>;
    }
    const expandedParcelDetails = await getExpandedParcelDetails(parcelId);

    return (<> 
            <DataViewer data={expandedParcelDetails.expandedParcelData} />
            <EventTable tableData={expandedParcelDetails.events} />
        </>)
};

export default ExpandedParcelDetails;
