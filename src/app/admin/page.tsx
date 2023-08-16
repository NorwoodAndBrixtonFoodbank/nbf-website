import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import { Metadata } from "next";
import { getUsers } from "@/app/admin/adminFunctions";
import AdminPage from "@/app/admin/AdminPage";
import supabase from "@/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// disables caching
export const revalidate = 0;

const Admin = async (): Promise<ReactElement> => {
    const serverSupabase = createServerComponentClient({ cookies });

    // TODO Handle error
    const response = await serverSupabase.functions.invoke("admin-get-users", { body: {} });
    // console.log("PRINTING ERROR HEEYAH");
    // console.log(response.error);
    //
    // console.log("PRININT RESPONSE DATA HEEYAH");
    // console.log(response.data);
    //
    const userData = JSON.parse(response.data) ?? [];
    // console.log("PRININT USER DATA HEEYAH");
    // console.log(userData);

    // return <pre>{JSON.stringify(TEMP, null, 4)}</pre>;

    return (
        <main>
            <Title>Admin Panel</Title>
            <AdminPage userData={userData} /> {/* TODO REMOVE undefined*/}
            {/*<UsersTable userData={userData} />*/}
            <pre>{JSON.stringify(userData, null, 4)}</pre>
        </main>
    );
};

export const metadata: Metadata = {
    title: "Admin",
};

export default Admin;
