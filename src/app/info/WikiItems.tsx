import { DbWikiRow } from "@/databaseUtils";
import { WikiItemPositioner } from "@/app/info/StyleComponents";
import React from "react";
import { EditModeDependentItem } from "@/app/info/ClientSideHelpers";

interface WikiItemsProps {
    rows: DbWikiRow[];
}

interface WikiItemProps {
    row: DbWikiRow;
}

interface ContentPart {
    content: string;
    href?: string;
    key: string;
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

const WikiItem: React.FC<WikiItemProps> = ({ row }) => {
    return (
        <WikiItemPositioner>
            <EditModeDependentItem row={row} />
        </WikiItemPositioner>
    );
};

const WikiItems: React.FC<WikiItemsProps> = (props) => {
    const sortedRows: DbWikiRow[] = props.rows.slice().sort((r1: DbWikiRow, r2: DbWikiRow) => {
        return r1.row_order > r2.row_order ? 1 : -1;
    });
    return (
        <>
            {sortedRows.map((row: DbWikiRow) => {
                return <WikiItem row={row} key={row.wiki_key} />;
            })}
        </>
    );
};

export default WikiItems;
