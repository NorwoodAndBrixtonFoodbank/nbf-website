import React from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import getExpandedClientDetails from "@/app/clients/getExpandedClientDetails";
import ClientParcelsTable from "@/app/clients/ClientParcelsTable";
import { getClientParcelsDetails } from "@/app/clients/getClientParcelsData";
import { styled } from "styled-components";

interface Props {
    clientId: string;
}

const DeletedText = styled.div`
    font-weight: 600;
    padding: 0.5em 0 0 0;
    justify-content: center;
    display: flex;
    flex-direction: row;
`;

const ExpandedClientDetails = async ({ clientId }: Props): Promise<React.ReactElement> => {
    const expandedClientDetails = await getExpandedClientDetails(clientId);

    const expandedClientParcelsDetails = await getClientParcelsDetails(clientId);

    return (
        <>
            {expandedClientDetails.isActive ? (
                <DataViewer data={{ ...expandedClientDetails }} />
            ) : (
                <DeletedText>Client has been deleted.</DeletedText>
            )}
            <ClientParcelsTable parcelsData={expandedClientParcelsDetails} />
        </>
    );
};

export default ExpandedClientDetails;
