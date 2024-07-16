"use client";

import React, { useState, useEffect } from "react";
import WikiAccordian from "./WikiAccordian";

import { Supabase } from "@/supabaseUtils";
import { DbWikiRow } from "@/databaseUtils";
import supabase from "@/supabaseClient";

const getTopWikiRow = async (supabase: Supabase): Promise<DbWikiRow> => {
    const query = (await supabase.from("wiki").select("*").limit(1).single()) as {
        data: DbWikiRow;
        error: Error | null;
    };

    if (query.error) {
        throw query.error;
    }
    return query.data;
};

export const formatContent: (topRowContent: string) => (string | React.JSX.Element)[] = (
    topRowContent: string
) => {
    const topRowContentParts = topRowContent.split(/(\[.*\]\(.*\)|<.*>)/);
    let counter = 0;
    const formattedContent = topRowContentParts.map((part, index) => {
        if (index % 2 === 1) {
            const plainPart = part.slice(1, -1);
            if (plainPart.includes("](")) {
                const items = plainPart.split(/\]\(/);
                return (
                    <a href={items[1]} key={counter++}>
                        {items[0]}
                    </a>
                );
            } else {
                return (
                    <a href={plainPart} key={counter++}>
                        {plainPart}
                    </a>
                );
            }
        } else {
            return part;
        }
    });
    return formattedContent;
};

const InfoPage: React.FC = () => {
    const [topRow, setTopRow]: [DbWikiRow, (a: DbWikiRow) => void] = useState({
        title: "",
        content: "",
        order: -1,
    });
    useEffect(() => {
        const fetchData: () => Promise<void> = async () => {
            const temp: DbWikiRow = await getTopWikiRow(supabase);
            setTopRow(temp);
        };
        fetchData();
    }, []);
    const formattedContent = formatContent(topRow.content);

    return <WikiAccordian topRow={topRow} formattedContent={formattedContent} />;
};

export default InfoPage;
