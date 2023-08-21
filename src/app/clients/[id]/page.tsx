import { Metadata } from "next";
import React from "react";
import ViewClientPage from "@/app/clients/[id]/ViewClientPage";

interface ViewClientParameters {
    params: { id: string };
}

const ViewClient: ({ params }: ViewClientParameters) => Promise<React.ReactElement> = async ({
    params,
}) => {
    return (
        <main>
            <ViewClientPage clientID={params.id} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "View Client",
};

export default ViewClient;
