import React, { ChangeEvent } from "react";
import DataViewer from "@/components/DataViewer/DataViewer";
import getExpandedClientDetails from "@/app/clients/getExpandedClientDetails";
import ClientParcelsTable from "@/app/clients/ClientParcelsTable";
import { getClientParcelsDetails } from "@/app/clients/getClientParcelsData";
import { styled } from "styled-components";
import supabase from "@/supabaseClient";

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

    const onChangeNotes = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const { error } = await supabase
            .from("clients")
            .update({ notes: event.target.value })
            .eq("primary_key", expandedClientDetails.primaryKey);
        if (error) {
            return;
        }
    };

    //const [errorMessage, setErrorMessage] = useState<string|null>(null);

    return (
        <>
            {expandedClientDetails.isActive ? (
                <DataViewer
                    data={{ ...expandedClientDetails }}
                    fieldsToHide={["primaryKey"]}
                    editableFields={[{ key: "notes", onChange: onChangeNotes }]}
                />
            ) : (
                <DeletedText>Client has been deleted.</DeletedText>
            )}
            <ClientParcelsTable parcelsData={expandedClientParcelsDetails} />
        </>
    );
};

export default ExpandedClientDetails;
