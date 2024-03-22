"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import ClientForm from "@/app/clients/form/ClientForm";
import { Errors, FormErrors } from "@/components/Form/formFunctions";
import autofill from "@/app/clients/edit/[id]/autofill";
import { fetchClient, fetchFamily } from "@/common/fetch";
import { Schema } from "@/databaseUtils";

interface EditClientsParameters {
    params: { id: string };
}

const EditClients: ({ params }: EditClientsParameters) => React.ReactElement = ({
    params,
}: EditClientsParameters) => {
    const [clientData, setClientData] = useState<Schema["clients"]>();
    const [familyData, setFamilyData] = useState<Schema["families"][]>();

    useEffect(() => {
        (async () => {
            if (params.id) {
                setClientData(await fetchClient(params.id, supabase));
            }
        })();
    }, [params.id]);
    useEffect(() => {
        (async () => {
            if (clientData?.family_id) {
                setFamilyData(await fetchFamily(clientData.family_id, supabase));
            }
        })();
    }, [clientData?.family_id]);

    const initialFields = clientData && familyData ? autofill(clientData, familyData) : null;

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
            {initialFields && (
                <ClientForm
                    initialFields={initialFields}
                    initialFormErrors={initialFormErrors}
                    editMode
                    clientID={params.id}
                />
            )}
        </main>
    );
};

export default EditClients;
