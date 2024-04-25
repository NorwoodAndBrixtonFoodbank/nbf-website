"use client";

import React, { useCallback, useEffect, useState } from "react";
import Table, { SortState } from "@/components/Tables/Table";
import supabase from "@/supabaseClient";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import { fetchAuditLog, fetchAuditLogCount } from "./fetchAuditLogData";
import { auditLogTableHeaderKeysAndLabels } from "./columns";
import { getAuditLogErrorMessage, auditLogTableColumnDisplayFunctions } from "./format";
import {
    defaultNumberOfAuditLogRowsPerPage,
    numberOfAuditLogRowsPerPageOption,
} from "./rowsPerPageConstants";
import { AuditLogRow, convertAuditLogResponseToAuditLogRow } from "./types";
import { auditLogTableSortableColumns } from "./sortFunctions";

const AuditLogTable: React.FC = () => {
    const [auditLogDataPortion, setAuditLogDataPortion] = useState<AuditLogRow[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [auditLogCount, setAuditLogCount] = useState<number>(0);
    const [sortState, setSortState] = useState<SortState<AuditLogRow>>({ sortEnabled: false });
    const [auditLogCountPerPage, setAuditLogCountPerPage] = useState(
        defaultNumberOfAuditLogRowsPerPage
    );
    const [currentPage, setCurrentPage] = useState(1);
    const startPoint = (currentPage - 1) * auditLogCountPerPage;
    const endPoint = currentPage * auditLogCountPerPage - 1;

    const fetchAndDisplayAuditLog = useCallback(async () => {
        setErrorMessage(null);

        const { count, error: countError } = await fetchAuditLogCount(supabase);
        if (countError) {
            setErrorMessage(getAuditLogErrorMessage(countError));
            return;
        }
        setAuditLogCount(count);

        const { data, error } = await fetchAuditLog(supabase, startPoint, endPoint, sortState);
        if (error) {
            setErrorMessage(getAuditLogErrorMessage(error));
            return;
        }
        const convertedData = convertAuditLogResponseToAuditLogRow(data);
        setAuditLogDataPortion(convertedData);
    }, [startPoint, endPoint, sortState]);

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
                defaultShownHeaders={[
                    "action",
                    "createdAt",
                    "actorProfileId",
                    "content",
                    "wasSuccess",
                    "logId",
                ]}
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
                sortConfig={{
                    sortPossible: true,
                    sortableColumns: auditLogTableSortableColumns,
                    setSortState: setSortState,
                }}
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
