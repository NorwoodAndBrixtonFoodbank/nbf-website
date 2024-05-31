import React, { ChangeEvent, useEffect, useState } from "react";
import DataViewer, {
    DataForDataViewer,
    convertDataToDataForDataViewer,
} from "@/components/DataViewer/DataViewer";
import getExpandedClientDetails, {
    ExpandedClientData,
} from "@/app/clients/getExpandedClientDetails";
import ClientParcelsTable from "@/app/clients/ClientParcelsTable";
import {
    ExpandedClientParcelDetails,
    getClientParcelsDetails,
} from "@/app/clients/getClientParcelsData";
import { styled } from "styled-components";
import supabase from "@/supabaseClient";
import { ErrorSecondaryText } from "../errorStylingandMessages";
import { CircularProgress } from "@mui/material";
import { Centerer } from "@/components/Modal/ModalFormStyles";

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

const ExpandedClientDetails: React.FC<Props> = ({ clientId }) => {
    const [expandedClientDetails, setExpandedClientDetails] = useState<ExpandedClientData | null>(
        null
    );
    const [expandedClientParcelsDetails, setExpandedClientParcelsDetails] = useState<
        ExpandedClientParcelDetails[] | null
    >(null);

    const originalNotes = expandedClientDetails?.notes ?? null;

    const [notes, setNotes] = useState<string | null>(originalNotes);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setExpandedClientDetails(await getExpandedClientDetails(clientId));
            setExpandedClientParcelsDetails(await getClientParcelsDetails(clientId));
            setIsLoading(false);
        })();
    }, [clientId]);

    const onSaveNotes = async (): Promise<void> => {
        setErrorMessage(null);
        const { error } = await supabase
            .from("clients")
            .update({ notes: notes })
            .eq("primary_key", clientId);
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

    return isLoading ? (
        <Centerer>
            <CircularProgress />
        </Centerer>
    ) : (
        expandedClientDetails && (
            <>
                {expandedClientDetails.isActive ? (
                    <DataViewer
                        data={{ ...getExpandedClientDetailsForDataViewer(expandedClientDetails) }}
                    />
                ) : (
                    <DeletedText>Client has been deleted.</DeletedText>
                )}
                <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>
                {expandedClientParcelsDetails && (
                    <ClientParcelsTable parcelsData={expandedClientParcelsDetails} />
                )}
            </>
        )
    );
};

export default ExpandedClientDetails;
