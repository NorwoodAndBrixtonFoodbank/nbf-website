"use client";

import React, { useCallback, useEffect, useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import { logErrorReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import { Json } from "@/databaseTypesFile";
import { formatDateTime, formatBoolean, formatJson } from "@/common/format";
import { AuditLogCountError, AuditLogError, fetchAuditLog, fetchAuditLogCount } from "./fetchAuditLogData";

export interface AuditLogRow {
    action: string;
    clientId: string;
    collectionCentreId: string;
    content: Json;
    createdAt: string;
    eventId: string;
    listHotelId: string;
    listId: string;
    logId: string;
    packingSlotId: string;
    parcelId: string;
    profileId: string;
    statusOrder: string;
    userId: string;
    wasSuccess: boolean;
    websiteData: string;
}

const auditLogTableHeaderKeysAndLabels: TableHeaders<AuditLogRow> = [
    ["action", "Action"],
    ["createdAt", "Time"],
    ["userId", "User ID"],
    ["content", "Content"],
    ["wasSuccess", "Success"],
    ["logId", "Log ID"],
    ["parcelId", "Parcel ID"],
    ["clientId", "Client ID"],
    ["eventId", "Event ID"],
    ["listId", "List ID"],
    ["collectionCentreId", "Collection Centre ID"],
    ["profileId", "Profile ID"],
    ["packingSlotId", "Packing Slot ID"],
    ["listHotelId", "List Hotel ID"],
    ["statusOrder", "Status Order"],
    ["websiteData", "Website Data"],
];

const auditLogTableColumnDisplayFunctions = {
    createdAt: formatDateTime,
    wasSuccess: formatBoolean,
    content: formatJson
};

const getErrorMessage = (error: AuditLogError | AuditLogCountError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedAuditLogFetch":
            errorMessage = "Failed to fetch audit log."
            break
        case "failedAuditLogCountFetch":
            errorMessage = "Failed to fetch audit log count."
            break
        case "nullCount":
            errorMessage = "Audit log table empty."
            
    }
    return (`${errorMessage} Log ID: ${error.logId}`);
}

const defaultNumberOfAuditLogRowsPerPage = 10;
const numberOfAuditLogRowsPerPageOption = [10, 25, 50, 100];

const AuditLogTable: React.FC = () => {
    const [auditLogDataPortion, setAuditLogDataPortion] = useState<AuditLogRow[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [auditLogCount, setAuditLogCount] = useState<number>(0);

    const [auditLogCountPerPage, setAuditLogCountPerPage] = useState(defaultNumberOfAuditLogRowsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const startPoint = (currentPage - 1) * auditLogCountPerPage;
    const endPoint = currentPage * auditLogCountPerPage - 1;

    const fetchAndDisplayAuditLog = useCallback(async () => {
        setErrorMessage(null);

        const { count, error: countError } = await fetchAuditLogCount(supabase);
        if (countError) {
            setErrorMessage(getErrorMessage(countError))
            return;
        }
        setAuditLogCount(count);

        const { data, error } = await fetchAuditLog(supabase, startPoint, endPoint);
        if (error) {
            setErrorMessage(getErrorMessage(error))
            return;
        }
        setAuditLogDataPortion(data);

    }, [startPoint, endPoint]);

    useEffect(() => {
        void fetchAndDisplayAuditLog();
    }, [fetchAndDisplayAuditLog]);

    useEffect(() => {
        const subscriptionChannel = supabase
            .channel("audit-logs-table-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "audit_log" },
                fetchAndDisplayAuditLog
            )
            .subscribe((status, err) => {
                if (subscriptionStatusRequiresErrorMessage(status, err, "audit_log")) {
                    setErrorMessage("Error fetching data, please reload");
                }
            });

        return () => {
            void supabase.removeChannel(subscriptionChannel);
        };
    }, [fetchAndDisplayAuditLog]);

    return (
        <>
            {errorMessage && <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>}
            <Table
                dataPortion={auditLogDataPortion}
                headerKeysAndLabels={auditLogTableHeaderKeysAndLabels}
                defaultShownHeaders={["action", "createdAt", "userId", "content", "wasSuccess", "logId"]}
                toggleableHeaders={[
                    "parcelId",
                    "clientId",
                    "eventId",
                    "listId",
                    "collectionCentreId",
                    "profileId",
                    "packingSlotId",
                    "listHotelId",
                    "statusOrder",
                    "websiteData",
                ]}
                columnDisplayFunctions={auditLogTableColumnDisplayFunctions}
                paginationConfig={{
                    enablePagination: true,
                    filteredCount: auditLogCount,
                    onPageChange: setCurrentPage,
                    onPerPageChange: setAuditLogCountPerPage,
                    defaultRowsPerPage: defaultNumberOfAuditLogRowsPerPage,
                    rowsPerPageOptions: numberOfAuditLogRowsPerPageOption,
                }}
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

export default AuditLogTable;
