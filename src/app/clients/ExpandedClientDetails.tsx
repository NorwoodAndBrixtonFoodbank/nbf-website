import React from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import getExpandedClientDetails from "@/app/clients/getExpandedClientDetails";
import ClientParcelsTable from "@/app/clients/ClientParcelsTable";
import { getExpandedClientParcelsDetails } from "@/app/clients/getClientParcelsData";

interface Props {
    clientId: string | null;
}

const ExpandedClientDetails = async ({ clientId }: Props): Promise<React.ReactElement> => {
    if (!clientId) {
        return <></>;
    }

    const expandedClientDetails = await getExpandedClientDetails(clientId);

    const expandedClientParcelsDetails = await getExpandedClientParcelsDetails(clientId);
    return (
        <>
            <DataViewer data={expandedClientDetails} />
            <ClientParcelsTable parcelsData={expandedClientParcelsDetails} />
        </>
    );
};

export default ExpandedClientDetails;
