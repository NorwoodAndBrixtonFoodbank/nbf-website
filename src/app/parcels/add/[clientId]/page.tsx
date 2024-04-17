import { Metadata } from "next";

import React from "react";
import AddParcelForm from "../AddParcelForm";

export interface AddParcelParameters {
    params: {
        clientId: string;
    };
}

const AddParcel = async ({ params }: AddParcelParameters): Promise<React.ReactElement> => {
    return (
        <main>
            <AddParcelForm clientId={params.clientId} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Edit Parcels",
};

export default AddParcel;
