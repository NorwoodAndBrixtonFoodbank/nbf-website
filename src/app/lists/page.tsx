import { Metadata } from "next";
import React from "react";
import ListsDataView from "./dataview";

const Lists: React.FC<{}> = () => {
    return (
        <main>
            <ListsDataView />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Lists",
};

export default Lists;
