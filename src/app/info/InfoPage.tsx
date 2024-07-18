import React from "react";
import WikiItem from "@/app/info/WikiItem";
import { DbWikiRow } from "@/databaseUtils";
import supabase from "@/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

interface QuerySuccessType {
    data: DbWikiRow;
    error: null;
}
interface QueryFailureType {
    data: null;
    error: PostgrestError;
}

export type QueryType = QuerySuccessType | QueryFailureType;

export async function getTopWikiRow(): Promise<QueryType> {
    const query = (await supabase.from("wiki").select("*").limit(1).single()) as QueryType;
    return query;
}

const InfoPage: React.FC<QueryType> = ({ data, error }) => {
    if (error) {
        console.error(error);
        return <h3>Error occured when fetching data.</h3>;
    } else {
        const topRow = data;
        return <WikiItem row={topRow} />;
    }
};

export default InfoPage;
