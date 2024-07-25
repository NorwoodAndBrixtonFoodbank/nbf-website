"use client";

import { DbWikiRow } from "@/databaseUtils";
import { ButtonMargin } from "@/app/info/StyleComponents";
import { Button } from "@mui/material";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { useRouter } from 'next/navigation'
import { PostgrestError } from "@supabase/supabase-js";
import { getWikiRows } from "./InfoPage";

interface WikiRowQuerySuccessType {
    data: DbWikiRow;
    error: null;
}

interface WikiRowQueryFailureType {
    data: null;
    error: PostgrestError;
}

interface WikiRowsQuerySuccessType {
    data: DbWikiRow[];
    error: null;
}
interface WikiRowsQueryFailureType {
    data: null;
    error: PostgrestError;
}

type WikiRowsQueryType = WikiRowsQuerySuccessType | WikiRowsQueryFailureType;

export type WikiRowQueryType = WikiRowQuerySuccessType | WikiRowQueryFailureType;


interface AddWikiItemButtonProps { 
    rows: DbWikiRow[];
}

const AddWikiItemButton: React.FC<AddWikiItemButtonProps> = ({rows}) => {
    const router = useRouter();

    const addWikiItem = async (rows: DbWikiRow[]) => {
        const query = (await supabase.from("wiki").select("*")) as WikiRowsQueryType;
        console.log(query.data);
        if (query.error) {logErrorReturnLogId("error fetching current wiki data", query.error)} 
        else {
            if(query.data.filter((row) => {return (!row.title && !row.content)}).length === 0) {
                const {data, error} = await supabase.from('wiki').insert({}).select().single() as WikiRowQueryType;
                if (error) {
                    logErrorReturnLogId("error inserting and fetching new data", error);
                }
                else {
                    rows.splice(0,rows.length)
                    rows.push(...query.data, data)
                    // router.refresh();
                    //location.reload();           
                }
            }
        }
    }

    return (
    <ButtonMargin>
        <Button variant="contained" onClick={()=>{addWikiItem(rows);}}>
            + Add
        </Button>
    </ButtonMargin>);
};

export default AddWikiItemButton;