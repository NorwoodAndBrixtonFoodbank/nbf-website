import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import { Metadata } from "next";
import AdminPage from "@/app/admin/AdminPage";
import { getUsers } from "@/app/admin/adminActions";

// disables caching
export const revalidate = 0;

const Admin = async (): Promise<ReactElement> => {
    // TODO VFB-23 Handle error returned by admin-get-users
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
