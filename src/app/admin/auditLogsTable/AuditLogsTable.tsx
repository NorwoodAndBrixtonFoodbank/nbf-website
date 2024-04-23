"use client";

import React, { useCallback, useEffect, useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import { Schema } from "@/databaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

const collectionCentresTableHeaderKeysAndLabels: TableHeaders<Schema["collection_centres"]> = [
    ["primary_key", "Centre ID"],
    ["name", "Name"],
    ["acronym", "Acronym"],
];

const AuditLogsTable: React.FC = () => {
    const [collectionCentres, setCollectionCentres] = useState<Schema["collection_centres"][]>([]);
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
                    primaryFiltersShown: false,
                    additionalFiltersShown: false,
                }}
            />
        </>
    );
};

export default AuditLogsTable;
