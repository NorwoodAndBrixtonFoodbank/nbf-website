"use client";

import React, { useCallback, useEffect, useState } from "react";
import Table, { TableHeaders } from "@/components/Tables/Table";
import { logErrorReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";
import { subscriptionStatusRequiresErrorMessage } from "@/common/subscriptionStatusRequiresErrorMessage";
import { ErrorSecondaryText } from "@/app/errorStylingandMessages";
import { Json } from "@/databaseTypesFile";
import { formatDateTime, formatBoolean, formatJson } from "@/common/format";

interface AuditLogRow {
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

const AuditLogTable: React.FC = () => {
    const [auditLog, setAuditLog] = useState<AuditLogRow[]>([]);
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

        const convertedData: AuditLogRow[] = data.map((datum) => ({
            action: datum.action ?? "",
            clientId: datum.client_id ?? "",
            collectionCentreId: datum.collection_centre_id ?? "",
            content: datum.content ?? "",
            createdAt: datum.created_at ?? "",
            eventId: datum.event_id ?? "",
            listHotelId: datum.list_hotel_id ?? "",
            listId: datum.list_id ?? "",
            logId: datum.log_id ?? "",
            packingSlotId: datum.packing_slot_id ?? "",
            parcelId: datum.parcel_id ?? "",
            profileId: datum.profile_id ?? "",
            statusOrder: datum.status_order ?? "",
            userId: datum.user_id ?? "",
            wasSuccess: datum.wasSuccess ?? "",
            websiteData: datum.website_data ?? "",
        }));

        setAuditLog(convertedData);
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

export default AuditLogTable;
