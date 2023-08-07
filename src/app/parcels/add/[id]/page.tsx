import { Metadata } from "next";
import React from "react";
import AddParcelForm from "@/app/parcels/add/AddParcelForm";

const AddParcels: ({ params }: { params: { id: string } }) => React.ReactElement = ({
    params,
}: {
    params: { id: string };
}) => {
    return (
        <main>
            <AddParcelForm id={params.id} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Add Parcels",
};

export default AddParcels;
