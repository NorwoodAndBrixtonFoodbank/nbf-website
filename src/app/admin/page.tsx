import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import { Metadata } from "next";
import AdminPage from "@/app/admin/AdminPage";
import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { DatabaseError } from "@/app/errorClasses";
import { Schema, UserRole } from "@/databaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";

// disables caching
export const revalidate = 0;

export type DisplayedUserRole = UserRole | "UNKNOWN";
export interface UserRow {
    id: string;
    firstName: string;
    lastName: string;
    userRole: DisplayedUserRole;
    email: string;
    telephoneNumber: string;
    createdAt: number | null;
    updatedAt: number | null;
}

const getCollectionCentres = async (): Promise<Schema["collection_centres"][]> => {
    const supabase = getSupabaseServerComponentClient();
    const { data, error } = await supabase.from("collection_centres").select();

    // TODO VFB-23 Move error handling of this request to client side
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Collection Centres", {
            error: error,
        });
        throw new DatabaseError("fetch", "collection centres", logId);
    }

    return data;
};

const Admin = async (): Promise<ReactElement> => {
    const collectionCentreData = await getCollectionCentres();

    return (
        <main>
            <Title>Admin Panel</Title>
            <AdminPage collectionCentreData={collectionCentreData} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Admin",
};

export default Admin;
