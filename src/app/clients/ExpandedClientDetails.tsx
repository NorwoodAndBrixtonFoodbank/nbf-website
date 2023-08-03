import React from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import { getExpandedClientDetails } from "@/app/clients/getExpandedClientDetails";

interface Props {
    parcelId: string | null;
}

const ExpandedClientDetails = async (props: Props): Promise<React.ReactElement> => {
    if (props.parcelId === null) {
        return <></>;
    }

    const expandedClientDetails = await getExpandedClientDetails(props.parcelId);

    return (
        <>
            <DataViewer data={expandedClientDetails} />
            {/* PLACEHOLDER FOR STATUS LIST */}
        </>
    );
};

export default ExpandedClientDetails;
