"use client";

import { DbWikiRow } from "@/databaseUtils";
import { WikiItemPositioner } from "@/app/info/StyleComponents";
import React, { useEffect, useMemo, useRef } from "react";
import EditModeDependentItem from "@/app/info/EditModeDependentItem";
import AdminManagerDependentView from "@/app/info/AdminManagerDependentView";
import AddWikiItemButton from "@/app/info/AddWikiItemButton";

interface WikiItemsProps {
    rows: DbWikiRow[];
}

interface WikiItemProps {
    row: DbWikiRow;
    appendNewRow: (newRow: DbWikiRow, index: number) => void;
    removeRow: (row: DbWikiRow) => number;
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

const WikiItem: React.FC<WikiItemProps> = ({ row, appendNewRow, removeRow }) => {
    return (
        <WikiItemPositioner>
            <EditModeDependentItem row={row} appendNewRow={appendNewRow} removeRow={removeRow} />
        </WikiItemPositioner>
    );
};

const WikiItems: React.FC<WikiItemsProps> = ({ rows }) => {
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

        setDisplayRows((DisplayRows) => {
            const temp = DisplayRows.slice();
            temp.splice(index, 0, newRow);
            return temp;
        });
    };

    const removeRow = (row: DbWikiRow): number => {
        const indexToRemove: number = displayRows.findIndex(
            (sortedRow) => row.wiki_key === sortedRow.wiki_key
        );
        setDisplayRows((DisplayRows) => {
            const temp = DisplayRows.slice();
            temp.splice(indexToRemove, 1);
            return temp;
        });
        return indexToRemove;
    };
    return (
        <>
            <AdminManagerDependentView>
                <AddWikiItemButton
                    doesEmptyRowExist={doesEmptyRowExist}
                    appendNewRow={appendNewRow}
                />
            </AdminManagerDependentView>
            {displayRows.map((row: DbWikiRow) => {
                return (
                    <WikiItem
                        row={row}
                        appendNewRow={appendNewRow}
                        removeRow={removeRow}
                        key={row.wiki_key}
                    />
                );
            })}
            <div ref={wikiItemsEndRef} />
        </>
    );
};

export default WikiItems;
