import React from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import getExpandedClientDetails from "@/app/clients/getExpandedClientDetails";
import ClientParcelsTable from "@/app/clients/ClientParcelsTable";
import { getClientParcelsDetails } from "@/app/clients/getClientParcelsData";

interface Props {
    clientId: string;
}

const ExpandedClientDetails = async ({ clientId }: Props): Promise<React.ReactElement> => {
    const expandedClientDetails = await getExpandedClientDetails(clientId);

    const expandedClientParcelsDetails = await getClientParcelsDetails(clientId);

    return (
        <>
            <DataViewer data={{ ...expandedClientDetails }} />
            <ClientParcelsTable parcelsData={expandedClientParcelsDetails} />
        </>
    );
};

export default ExpandedClientDetails;
