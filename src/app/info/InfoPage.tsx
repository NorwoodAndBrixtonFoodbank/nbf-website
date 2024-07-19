import React from "react";
import WikiItems from "@/app/info/WikiItems";
import { DbWikiRow } from "@/databaseUtils";
import { PostgrestError } from "@supabase/supabase-js";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/databaseTypesFile";
import { logErrorReturnLogId } from "@/logger/logger";

interface QuerySuccessType {
    data: DbWikiRow[];
    error: null;
}
interface QueryFailureType {
    data: null;
    error: PostgrestError;
}

export type QueryType = QuerySuccessType | QueryFailureType;

export async function getWikiRows(): Promise<QueryType> {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
    const query = (await supabase.from("wiki").select("*")) as QueryType;
    return query;
}

const InfoPage: React.FC<QueryType> = ({ data, error }) => {
    if (error) {
        logErrorReturnLogId("error fetching wiki data", error);
    }
    return error ? <h3>Error occured when fetching data.</h3> : <WikiItems rows={data} />;
};

export default InfoPage;
