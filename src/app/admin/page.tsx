import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import { Metadata } from "next";
import AdminPage from "@/app/admin/AdminPage";
import { UserRole } from "@/databaseUtils";

// disables caching
export const revalidate = 0;

export type DisplayedUserRole = UserRole | "UNKNOWN";
export interface UserRow {
    userId: string;
    profileId: string;
    firstName: string;
    lastName: string;
    userRole: DisplayedUserRole;
    email: string;
    telephoneNumber: string;
    lastLoggedInAt: number | null;
    createdAt: number | null;
    updatedAt: number | null;
}

const Admin = async (): Promise<ReactElement> => {
    return (
        <main>
            <Title>Admin Panel</Title>
            <AdminPage />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Admin",
};

export default Admin;
