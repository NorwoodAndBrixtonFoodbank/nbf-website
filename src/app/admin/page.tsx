import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import { Metadata } from "next";
import AdminPage from "@/app/admin/AdminPage";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// disables caching
export const revalidate = 0;

const Admin = async (): Promise<ReactElement> => {
    const serverSupabase = createServerComponentClient({ cookies });

    // TODO VFB-23 Handle error returned by admin-get-users
    const response = await serverSupabase.functions.invoke("admin-get-users");
    const userData = JSON.parse(response.data) ?? [];

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
