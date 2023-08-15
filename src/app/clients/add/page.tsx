import { Metadata } from "next";

import React from "react";
import AddClientForm from "@/app/clients/add/AddClientForm";

const AddClients = (): React.ReactElement => {
    return (
        <main>
            <AddClientForm />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Add Clients",
};

export default AddClients;
