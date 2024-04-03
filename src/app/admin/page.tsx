import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import { Metadata } from "next";
import AdminPage from "@/app/admin/AdminPage";
import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { User } from "@supabase/gotrue-js";
import { DatabaseError } from "@/app/errorClasses";
import { Schema } from "@/databaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";
import { Database } from "@/databaseTypesFile";
import { adminGetUsers } from "@/server/adminGetUsers";
import { fetchUserRole } from "@/common/fetchUserRole";

// disables caching
export const revalidate = 0;

export interface UserRow {
    id: string;
    email: string;
    userRole: Database["public"]["Enums"]["role"];
    createdAt: number;
    updatedAt: number;
}

const getUsers = async (): Promise<UserRow[]> => {
    const { data, error } = await adminGetUsers();

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Users", error);
        throw new DatabaseError("fetch", "user information", logId);
    }

    const userRows = data.map(async (user: User) => {
        const userRole = await fetchUserRole(user.id, (error) => {
            return logErrorReturnLogId("Failed to fetch user role", { error });
        });

        return {
            id: user.id,
            email: user.email ?? "-",
            userRole: userRole,
            createdAt: Date.parse(user.created_at),
            updatedAt: Date.parse(user.updated_at ?? ""),
        };
    });
    return await Promise.all(userRows);
};

const getCollectionCentres = async (): Promise<Schema["collection_centres"][]> => {
    const supabase = getSupabaseServerComponentClient();
    const { data, error } = await supabase.from("collection_centres").select();

    // TODO VFB-23 Move error handling of this request to client side
    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Collection Centres", error);
        throw new DatabaseError("fetch", "collection centres", logId);
    }

    return data;
};

const Admin = async (): Promise<ReactElement> => {
    const [userData, collectionCentreData] = await Promise.all([
        getUsers(),
        getCollectionCentres(),
    ]);

    return (
        <main>
            <Title>Admin Panel</Title>
            <AdminPage userData={userData} collectionCentreData={collectionCentreData} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Admin",
};

export default Admin;
