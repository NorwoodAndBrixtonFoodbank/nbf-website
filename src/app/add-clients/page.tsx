import { Metadata } from "next";

import React from "react";
import AddClientForm from "@/app/add-clients/pageComponents";

const AddClients: () => React.ReactElement = () => {
    return (
        <main>
            <AddClientForm />
        </main>
    );
};

export const metadata: Metadata = {
    title: "AddClients",
};

export default AddClients;
