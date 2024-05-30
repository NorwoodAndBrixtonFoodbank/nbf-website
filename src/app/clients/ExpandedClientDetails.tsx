import React, { ChangeEvent, useState } from "react";
import DataViewer, {
    DataForDataViewer,
    convertDataToDataForDataViewer,
} from "@/components/DataViewer/DataViewer";
import getExpandedClientDetails, {
    ExpandedClientData,
} from "@/app/clients/getExpandedClientDetails";
import ClientParcelsTable from "@/app/clients/ClientParcelsTable";
import { getClientParcelsDetails } from "@/app/clients/getClientParcelsData";
import { styled } from "styled-components";
import supabase from "@/supabaseClient";
import { ErrorSecondaryText } from "../errorStylingandMessages";

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

    const originalNotes = expandedClientDetails.notes;

    const [notes, setNotes] = useState<string | null>(originalNotes);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSaveNotes = async (): Promise<void> => {
        setErrorMessage(null);
        const { error } = await supabase
            .from("clients")
            .update({ notes: notes })
            .eq("primary_key", expandedClientDetails.primaryKey);
        if (error) {
            setErrorMessage("Error saving notes");
        }
    };

    const onChangeNotes = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setNotes(event.target.value);
    };

    const onCancelNotes = async (): Promise<void> => {
        setNotes(originalNotes);
    };

    const getExpandedClientDetailsForDataViewer = (
        expandedClientDetails: ExpandedClientData
    ): DataForDataViewer => {
        const expandedClientDetailsForDataViewer = convertDataToDataForDataViewer({
            ...expandedClientDetails,
        });
        delete expandedClientDetailsForDataViewer["primary_key"];
        expandedClientDetailsForDataViewer["notes"] = {
            value: expandedClientDetails["notes"],
            editFunctions: {
                onChange: onChangeNotes,
                onCancel: onCancelNotes,
                onSave: onSaveNotes,
            },
        };
        return expandedClientDetailsForDataViewer;
    };

    return (
        <>
            {expandedClientDetails.isActive ? (
                <DataViewer
                    data={{ ...getExpandedClientDetailsForDataViewer(expandedClientDetails) }}
                />
            ) : (
                <DeletedText>Client has been deleted.</DeletedText>
            )}
            <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>
            <ClientParcelsTable parcelsData={expandedClientParcelsDetails} />
        </>
    );
};

export default ExpandedClientDetails;
