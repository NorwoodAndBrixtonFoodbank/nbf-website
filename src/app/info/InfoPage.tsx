import React from "react";
import WikiItem from "@/app/info/WikiItem";
import { DbWikiRow } from "@/databaseUtils";
import { PostgrestError } from "@supabase/supabase-js";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/databaseTypesFile";

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
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
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
