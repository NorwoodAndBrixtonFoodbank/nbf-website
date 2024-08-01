"use client";

import { DbWikiRow } from "@/databaseUtils";
import { WikiItemPositioner } from "@/app/info/StyleComponents";
import React, { useEffect, useMemo, useRef, useState } from "react";
import EditModeDependentItem from "@/app/info/EditModeDependentItem";
import AdminManagerDependentView from "@/app/info/AdminManagerDependentView";
import AddWikiItemButton from "@/app/info/AddWikiItemButton";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { AuditLog, sendAuditLog } from "@/server/auditLog";
import { TextValueContainer } from "../admin/auditLogTable/auditLogModal/AuditLogModalRow";
import { ErrorSecondaryText } from "../errorStylingandMessages";

interface WikiItemsProps {
    rows: DbWikiRow[];
}

interface WikiItemProps {
    row: DbWikiRow;
    appendNewRow: (newRow: DbWikiRow, index: number) => void;
    removeRow: (row: DbWikiRow) => number;
    swapRows: (row1: DbWikiRow, upwards: boolean) => void;
    setErrorMessage: (errorMessage: string | null) => void;
}

interface ContentPart {
    content: string;
    key: string;
    href?: string;
}

export const convertContentToElements = (rowContent: string): React.JSX.Element[] => {
    const rowContentParts = rowContent.split(/(\[.*\]\(.*\)|<.*>)/);
    const contentParts: ContentPart[] = rowContentParts.map((part, index) => {
        if (index % 2 === 1) {
            const plainPart = part.slice(1, -1);
            if (plainPart.includes("](")) {
                const items = plainPart.split(/\]\(/);
                return { content: items[0], href: items[1], key: crypto.randomUUID() };
            } else {
                return { content: plainPart, href: plainPart, key: crypto.randomUUID() };
            }
        } else {
            return { content: part, key: crypto.randomUUID() };
        }
    });
    return contentParts.map((part: ContentPart) => {
        return part.href ? (
            <a href={part.href} key={part.key}>
                {part.content}
            </a>
        ) : (
            <span key={part.key}>{part.content}</span>
        );
    });
};

const WikiItem: React.FC<WikiItemProps> = ({
    row,
    appendNewRow,
    removeRow,
    swapRows,
    setErrorMessage,
}) => {
    return (
        <WikiItemPositioner>
            <EditModeDependentItem
                row={row}
                appendNewRow={appendNewRow}
                removeRow={removeRow}
                swapRows={swapRows}
                setErrorMessage={setErrorMessage}
            />
        </WikiItemPositioner>
    );
};

const WikiItems: React.FC<WikiItemsProps> = ({ rows }) => {
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const sortedRows: DbWikiRow[] = rows.slice().sort((r1: DbWikiRow, r2: DbWikiRow) => {
        return r1.row_order > r2.row_order ? 1 : -1;
    });

    const [displayRows, setDisplayRows] = React.useState<DbWikiRow[]>(sortedRows);

    const wikiItemsEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (wikiItemsEndRef.current) {
            wikiItemsEndRef.current.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [displayRows]);

    const doesEmptyRowExist: boolean = useMemo(
        () => displayRows.some((row) => !row.title && !row.content),
        [displayRows]
    );

    const appendNewRow = (newRow: DbWikiRow, index: number): void => {
        if (index === -1) {
            index = displayRows.length;
        }

        setDisplayRows((displayRows) => {
            const temp = displayRows.slice();
            temp.splice(index, 0, newRow);
            return temp;
        });
    };

    const removeRow = (row: DbWikiRow): number => {
        const indexToRemove: number = displayRows.findIndex(
            (sortedRow) => row.wiki_key === sortedRow.wiki_key
        );
        setDisplayRows((displayRows) => {
            const temp = displayRows.slice();
            temp.splice(indexToRemove, 1);
            return temp;
        });
        return indexToRemove;
    };

    const [isSwapping, setIsSwapping] = useState(false);

    const swapRows = async (row1: DbWikiRow, upwards: boolean): Promise<void> => {
        if (isSwapping) {
            return;
        }
        setIsSwapping(true);

        const rowIndex1 = displayRows.findIndex((row) => {
            return row.wiki_key == row1.wiki_key;
        });
        const rowIndex2 = rowIndex1 + (upwards ? -1 : 1);

        if (rowIndex2 < 0 || rowIndex2 >= displayRows.length) {
            setIsSwapping(false);
            return;
        }

        const row2 = displayRows[rowIndex2];

        const { error } = await supabase.rpc("swap_two_wiki_rows", {
            key1: row1.wiki_key,
            key2: row2.wiki_key,
        });

        const auditLog = {
            action: `move a wiki item ${row1.row_order <= row2.row_order ? "down" : "up"}`,
            wikiId: row1.wiki_key,
            content: {
                itemName: row1.title,
                oldRow_order: row1.row_order,
            },
        } as const satisfies Partial<AuditLog>;

        if (error) {
            const logId = await logErrorReturnLogId(
                "Error with supabase function swap_two_wiki_rows",
                {
                    error: error,
                }
            );
            setErrorMessage(`Failed to swap rows. Log ID: ${logId}`);

            void sendAuditLog({
                ...auditLog,
                wasSuccess: false,
                logId: logId,
            });
            return;
        } else {
            void sendAuditLog({
                ...auditLog,
                wasSuccess: true,
                content: { ...auditLog.content, newRow_order: row2.row_order },
            });
        }
        setIsSwapping(false);

        reorderRows(row1, row2);
    };

    const reorderRows = (row1: DbWikiRow, row2: DbWikiRow): void => {
        const wiki_keys = displayRows.map((displayRows) => displayRows.wiki_key);

        const row1Index = wiki_keys.indexOf(row1.wiki_key);
        const row2Index = wiki_keys.indexOf(row2.wiki_key);

        const row1Item = displayRows[row1Index];
        const row1Order = row1Item.row_order;

        const row2Item = displayRows[row2Index];
        const row2Order = row2Item.row_order;

        row1Item.row_order = row2Order;
        row2Item.row_order = row1Order;

        const newDisplayRows = [...displayRows];

        newDisplayRows[row1Index] = row2Item;
        newDisplayRows[row2Index] = row1Item;

        setDisplayRows(newDisplayRows);
    };

    return (
        <>
            <AdminManagerDependentView>
                <AddWikiItemButton
                    doesEmptyRowExist={doesEmptyRowExist}
                    appendNewRow={appendNewRow}
                />
            </AdminManagerDependentView>
            {errorMessage && (
                <TextValueContainer>
                    <ErrorSecondaryText>{errorMessage}</ErrorSecondaryText>
                </TextValueContainer>
            )}
            {displayRows.map((row: DbWikiRow) => {
                return (
                    <WikiItem
                        row={row}
                        appendNewRow={appendNewRow}
                        removeRow={removeRow}
                        swapRows={swapRows}
                        key={row.wiki_key}
                        setErrorMessage={setErrorMessage}
                    />
                );
            })}
            <div ref={wikiItemsEndRef} />
        </>
    );
};

export default WikiItems;
