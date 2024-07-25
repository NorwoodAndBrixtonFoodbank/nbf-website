import React from "react";
import WikiItems from "@/app/info/WikiItems";
import { DbWikiRow } from "@/databaseUtils";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/databaseTypesFile";
import { logErrorReturnLogId } from "@/logger/logger";

interface WikiRowsQuerySuccessType {
    data: DbWikiRow[];
    error: null;
}
interface WikiRowsQueryFailureType {
    data: null;
    error: PostgrestError;
}

type WikiRowsQueryType = WikiRowsQuerySuccessType | WikiRowsQueryFailureType;

export async function getWikiRows(): Promise<WikiRowsQueryType> {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
    const query = (await supabase.from("wiki").select("*")) as WikiRowsQueryType;
    // if (query.data) {
    //     removeEmptyWikiRows(query.data, supabase);
    // }    
    return query;
}

const removeEmptyWikiRows = async (rows: DbWikiRow[], supabase: SupabaseClient): Promise<void> => {
    const keys = rows.filter((row) => { return (!row.title && !row.content)}).map((row) => {return row.wiki_key});
    if (keys.length > 0) {
        const {error} = await supabase
            .from('wiki')
            .delete()
            .in('wiki_key', keys)
        if (error) {
            logErrorReturnLogId("error deleting the empty row", error);
        }
    }
}

const InfoPage: React.FC<WikiRowsQueryType> = ({ data, error }) => {
    if (error) {
        logErrorReturnLogId("error fetching wiki data", error);
    }
    return error ? <h3>Error occured when fetching data.</h3> : 
    <WikiItems rows={data} />;

};

export default InfoPage;
