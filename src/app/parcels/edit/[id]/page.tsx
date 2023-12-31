import { Metadata } from "next";

import React from "react";
import EditParcelForm from "../editParcelForm";

interface EditParcelsParameters {
    params: { id: string };
}

const EditParcels = async ({ params }: EditParcelsParameters): Promise<React.ReactElement> => {
    return (
        <main>
            <EditParcelForm parcelId={params.id} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Edit Parcels",
};

export default EditParcels;
