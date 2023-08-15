import { Metadata } from "next";
import React from "react";

const AddParcels = (): React.ReactElement => {
    return (
        <main>
            <a href="/parcels/add/764edcec-8d4b-492d-a36a-86c921b4f8de">CLICK HERE</a>
            <p>this is a temporary page in order to allow access to parcels!</p>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Add Parcels",
};

export default AddParcels;
