import { Metadata } from "next";
import React from "react";
import getClientData from "@/app/clients/[id]/getClientData";
import ViewClientPage from "@/app/clients/[id]/viewClientPage";

interface ViewClientParameters {
    params: { id: string };
}

const ViewClient: ({ params }: ViewClientParameters) => Promise<React.ReactElement> = async ({
    params,
}) => {
    const clientData = await getClientData(params.id);
    return (
        <main>
            <ViewClientPage clientID={params.id} clientData={clientData} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "View Client",
};

export default ViewClient;
