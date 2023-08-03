import { Metadata } from "next";

import React from "react";
import AddParcelForm from "@/app/parcels/add/AddParcelForm";

const AddParcels: () => React.ReactElement = () => {
    return (
        <main>
            <AddParcelForm />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Add Parcels",
};

export default AddParcels;
