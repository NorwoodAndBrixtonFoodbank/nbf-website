import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import { Metadata } from "next";
import AdminPage from "@/app/admin/AdminPage";
import { Database } from "@/databaseTypesFile";
import supabase from "@/supabaseServer";
import { User } from "@supabase/gotrue-js";
import { DatabaseError } from "@/app/errorClasses";
import { Schema } from "@/databaseUtils";

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
    const { data, error } = await supabase.functions.invoke("admin-get-users");

    if (error) {
        throw new DatabaseError("fetch", "user information");
    }

    const users: User[] = data;

    return users.map((user: User) => {
        return {
            id: user.id,
            email: user.email ?? "-",
            userRole: user.app_metadata.role ?? "-",
            createdAt: Date.parse(user.created_at),
            updatedAt: Date.parse(user.updated_at ?? ""),
        };
    });
};

const getCollectionCentres = async (): Promise<Schema["collection_centres"][]> => {
    const { data, error } = await supabase.from("collection_centres").select();

    // TODO VFB-23 Move error handling of this request to client side
    if (error) {
        throw new DatabaseError("fetch", "collection centres");
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
