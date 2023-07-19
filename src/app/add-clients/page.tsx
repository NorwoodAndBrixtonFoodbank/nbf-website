import { Metadata } from "next";

import React from "react";
import RequestForm from "@/app/add-clients/pageComponents";

const AddClients: () => React.ReactElement = () => {
    return (
        <main>
            <RequestForm />
        </main>
    );
};

export const metadata: Metadata = {
    title: "AddClients",
};

export default AddClients;
