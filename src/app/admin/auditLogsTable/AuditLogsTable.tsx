"use client";

import React, { useCallback, useEffect, useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import { Schema } from "@/databaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";

const collectionCentresTableHeaderKeysAndLabels: TableHeaders<Schema["audit_log"]> = [
["primary_key", "Primary Key"]
];

const AuditLogsTable: React.FC = () => {
    const [auditLog, setAuditLog] = useState<Schema["audit_log"][]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchAndDisplayAuditLog = useCallback(async () => {
        const { data, error } = await supabase.from("audit_log").select();

        if (error) {
            const logId = await logErrorReturnLogId("Error with fetch: Audit Log", {
                error: error,
            });
            setErrorMessage(`Failed to fetch audit log. Log ID: ${logId}`);
            return;
        }

        setAuditLog(data);
    }, []);

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
                dataPortion={auditLog}
                headerKeysAndLabels={collectionCentresTableHeaderKeysAndLabels}
                defaultShownHeaders={["primary_key"]}
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
