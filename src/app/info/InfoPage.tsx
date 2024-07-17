import React, { useState, useEffect } from "react";
import WikiItem from "@/app/info/WikiItem";

import { Supabase } from "@/supabaseUtils";
import { DbWikiRow } from "@/databaseUtils";
import supabase from "@/supabaseClient";

import { PostgrestError} from "@supabase/supabase-js";

interface QuerySuccessType {
  data: DbWikiRow;
  error: null;
}
interface QueryFailureType {  
  data: null
  error: PostgrestError
}

type QueryType = QuerySuccessType | QueryFailureType

const getTopWikiRow = async (supabase: Supabase): Promise<QueryType> => {
    const query = (await supabase.from("wiki").select("*").limit(1).single()) as QueryType;
    return query;
};

export async function getServerSideProps() {
  const query: QueryType = await getTopWikiRow(supabase);
  return query
}

const InfoPage: React.FC<QueryType> = ({data, error}) => {
  if (error) {
    console.error(error)
    return (<h3>Error occured when fetching data.</h3>)
  } else {
    const topRow = data;
    return (topRow.order !== -1) ? <WikiItem row={topRow}/> : <></>;
  }
};

export default InfoPage;
