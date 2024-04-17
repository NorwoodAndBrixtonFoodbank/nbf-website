"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import ClientForm from "@/app/clients/form/ClientForm";
import { Errors, FormErrors } from "@/components/Form/formFunctions";
import autofill from "@/app/clients/edit/[id]/autofill";
import { fetchClient, fetchFamily } from "@/common/fetch";
import { Schema } from "@/databaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";
import { useRouter } from "next/navigation";
import ErrorPage from "@/app/error";

interface EditClientsParameters {
    params: { id: string };
}

const EditClients: ({ params }: EditClientsParameters) => React.ReactElement = ({
    params,
}: EditClientsParameters) => {
    const [clientData, setClientData] = useState<Schema["clients"] | null>(null);
    const [familyData, setFamilyData] = useState<Schema["families"][] | null>(null);
    const [error, setError] = useState<Error | null>();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (!params.id) {
                return;
            }
            setError(null);
            const { data: clientData, error: clientError } = await fetchClient(params.id, supabase);
            if (clientError) {
                setError({ name: clientError.type, message: "Unable to fetch client data" });
                logErrorReturnLogId("error fetching client data in client edit modal");
                return;
            }
            setClientData(clientData);
            const { data: familyData, error: familyError } = await fetchFamily(
                clientData.family_id,
                supabase
            );
            if (familyError) {
                setError({ name: familyError.type, message: "Unable to fetch family data" });
                logErrorReturnLogId("error fetching family data in client edit modal");
                return;
            }
            setFamilyData(familyData);
        })();
    }, [params.id]);

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
            {error ? (
                <ErrorPage error={error} reset={() => router.refresh()} />
            ) : (
                initialFields && (
                    <ClientForm
                        initialFields={initialFields}
                        initialFormErrors={initialFormErrors}
                        editConfig={{ clientID: params.id, editMode: true }}
                    />
                )
            )}
        </main>
    );
};

export default EditClients;
