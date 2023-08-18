import { Metadata } from "next";

import React from "react";
import ClientForm from "@/app/clients/add/ClientForm";
import { Errors, FormErrors } from "@/components/Form/formFunctions";
import { fetchClients, fetchFamilies } from "@/app/clients/add/databaseFunctions";
import autofill from "@/app/clients/add/[id]/autofill";

interface EditClientsParameters {
    params: { id: string };
}

const EditClients: ({ params }: EditClientsParameters) => Promise<React.ReactElement> = async ({
    params,
}: EditClientsParameters) => {
    const clientData = await fetchClients(params.id);
    const familyData = await fetchFamilies(clientData.family_id);
    const initialFields = autofill(clientData, familyData);
    const initialFormErrors: FormErrors = {
        fullName: Errors.none,
        phoneNumber: Errors.none,
        addressLine1: Errors.none,
        addressPostcode: Errors.none,
        adults: Errors.none,
        numberChildren: Errors.none,
        nappySize: Errors.none,
    };
    return (
        <main>
            <ClientForm
                initialFields={initialFields}
                initialFormErrors={initialFormErrors}
                editMode
                clientID={params.id}
            />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Edit Clients",
};

export default EditClients;
