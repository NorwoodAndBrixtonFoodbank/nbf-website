"use client";

import React, { useState, useEffect } from "react";
import WikiItems from "@/app/info/WikiItems";

import { Supabase } from "@/supabaseUtils";
import { DbWikiRow } from "@/databaseUtils";
import supabase from "@/supabaseClient";
import Error from "next/error";

interface QueryType {
  data: DbWikiRow | null;
  error: Error | null;
}

const getTopWikiRow = async (supabase: Supabase): Promise<QueryType> => {
    const query = (await supabase.from("wiki").select("*").limit(1).single()) as QueryType;
    return query;
};

const InfoPage: React.FC = () => {
    const [topRow, setTopRow] = useState<DbWikiRow | null>(null); 
    try {
      useEffect(() => {
        const fetchData: () => Promise<void> = async () => {
            const temp: QueryType = await getTopWikiRow(supabase);
            if (temp.error) {
              throw temp.error;
            } else if(temp.data) {
              setTopRow(temp.data);
            }
        };
        fetchData();
      }, []);
    } catch (e: any) {
      return (
      <>
        <h3>Error Occured</h3>
        <p>{e}</p>
      </>
      );
    }

    return (topRow && topRow.order !== -1) ? <WikiItems row={topRow}/> : <></>;
};

export default InfoPage;
