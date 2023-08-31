import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import { Metadata } from "next";
import AdminPage from "@/app/admin/AdminPage";
import { Datum } from "@/components/Tables/Table";
import { Database } from "@/databaseTypesFile";
import supabase from "@/supabaseServer";
import { User } from "@supabase/gotrue-js";
import { DatabaseError } from "@/app/errorClasses";

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

    const users: User[] = JSON.parse(data);

    return users.map((user: User) => {
        return {
            id: user.id,
            email: user.email ?? "-",
            userRole: user.app_metadata.role,
            createdAt: Date.parse(user.created_at),
            updatedAt: Date.parse(user.updated_at ?? ""),
        };
    });
};

const Admin = async (): Promise<ReactElement> => {
    const userData = await getUsers();

    return (
        <main>
            <Title>Admin Panel</Title>
            <AdminPage userData={userData} />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Admin",
};

export default Admin;
