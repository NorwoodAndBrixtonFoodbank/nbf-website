import { Metadata } from "next";
import React, { ReactElement } from "react";
import ListsDataView from "./dataview";
import supabase from "@/supabase";
import { Database } from "@/database_types_file";

const fetchData = async (): Promise<Database["public"]["Tables"]["lists"]["Row"][] | null> => {
    supabase.channel("lists").subscribe();
    return (await supabase.from("lists").select("*")).data;
};

const Lists = async (): Promise<ReactElement> => {
    const data = await fetchData();

    return (
        <main>
            <h1>Lists Page</h1>
            <ListsDataView data={data} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Lists",
};

export default Lists;
