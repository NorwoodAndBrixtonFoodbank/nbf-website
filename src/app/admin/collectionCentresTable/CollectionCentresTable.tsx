"use client";

import React, { useCallback, useEffect, useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import styled from "styled-components";
import { Schema } from "@/databaseUtils";
import { ClientSideFilter, PaginationType } from "@/components/Tables/Filters";
import { buildClientSideTextFilter, filterRowByText } from "@/components/Tables/TextFilter";
import { logErrorReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

interface CollectionCentresTableRow {
    acronym: Schema["collection_centres"]["acronym"];
    name: Schema["collection_centres"]["name"];
    primary_key: Schema["collection_centres"]["primary_key"];
}

export const OptionButtonDiv = styled.div`
    display: flex;
    padding-top: 1rem;
    gap: 1rem;
    justify-content: center;
`;

const collectionCentresTableHeaderKeysAndLabels: TableHeaders<Schema["collection_centres"]> = [
    ["primary_key", "Centre ID"],
    ["name", "Name"],
    ["acronym", "Acronym"],
];

const filters: ClientSideFilter<CollectionCentresTableRow, string>[] = [
    buildClientSideTextFilter({
        key: "name",
        label: "Name",
        headers: collectionCentresTableHeaderKeysAndLabels,
        method: filterRowByText,
    }),
    buildClientSideTextFilter({
        key: "acronym",
        label: "Acronym",
        headers: collectionCentresTableHeaderKeysAndLabels,
        method: filterRowByText,
    }),
];

const CollectionCentresTables: React.FC = () => {
    const [collectionCentres, setCollectionCentres] = useState<Schema["collection_centres"][]>([]);
    const [primaryFilters, setPrimaryFilters] =
        useState<ClientSideFilter<CollectionCentresTableRow, string>[]>(filters);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchAndDisplayCollectionCentres = useCallback(async () => {
        const { data, error } = await supabase.from("collection_centres").select();

        if (error) {
            const logId = await logErrorReturnLogId("Error with fetch: Collection Centres", {
                error: error,
            });
            setErrorMessage(`Failed to fetch collection centres. Log ID: ${logId}`);
            return;
        }

        setCollectionCentres(data);
    }, []);

    useEffect(() => {
        void fetchAndDisplayCollectionCentres();
    }, [fetchAndDisplayCollectionCentres]);

    useEffect(() => {
        const subscriptionChannel = supabase
            .channel("collection-centres-table-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "collection_centres" },
                fetchAndDisplayCollectionCentres
            )
            .subscribe((status, err) => {
                if (subscriptionStatusRequiresErrorMessage(status, err, "collection_centres")) {
                    setErrorMessage("Error fetching data, please reload");
                }
            });

        return () => {
            void supabase.removeChannel(subscriptionChannel);
        };
    }, [fetchAndDisplayCollectionCentres]);

    return (
        <>
            {errorMessage && <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>}
            <Table
                dataPortion={collectionCentres}
                headerKeysAndLabels={collectionCentresTableHeaderKeysAndLabels}
                defaultShownHeaders={["name", "acronym"]}
                toggleableHeaders={["primary_key"]}
                paginationConfig={{ enablePagination: false }}
                checkboxConfig={{ displayed: false }}
                sortConfig={{ sortPossible: false }}
                editableConfig={{
                    editable: false,
                }}
                filterConfig={{
                    paginationType: PaginationType.Client,
                    primaryFiltersShown: true,
                    primaryFilters: primaryFilters,
                    setPrimaryFilters: setPrimaryFilters,
                    additionalFiltersShown: false,
                }}
            />
        </>
    );
};

export default CollectionCentresTables;
