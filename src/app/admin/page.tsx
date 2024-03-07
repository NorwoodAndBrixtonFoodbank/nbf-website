import React, { ReactElement } from "react";
import Title from "@/components/Title/Title";
import { Metadata } from "next";
import AdminPage from "@/app/admin/AdminPage";
import { Database } from "@/databaseTypesFile";
import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { User } from "@supabase/gotrue-js";
import { DatabaseError } from "@/app/errorClasses";
import { Schema } from "@/databaseUtils";
import { PackingSlotRow } from "@/app/admin/packingSlotsTable/PackingSlotsTable";
import { DBPackingSlotData } from "@/app/admin/packingSlotsTable/PackingSlotActions";

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
    const supabase = getSupabaseServerComponentClient();
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
    const supabase = getSupabaseServerComponentClient();
    const { data, error } = await supabase.from("collection_centres").select();

    // TODO VFB-23 Move error handling of this request to client side
    if (error) {
        throw new DatabaseError("fetch", "collection centres");
    }

    return data;
};

const getPackingSlots = async (): Promise<Schema["packing_slots"][]> => {
    const supabase = getSupabaseServerComponentClient();
    const { data, error } = await supabase.from("packing_slots").select().order("order");
    if (error) {
        throw new DatabaseError("fetch", "packing slots");
    }
    const packingSlots: DBPackingSlotData[] = data;

    const processedData = packingSlots.map((data: DBPackingSlotData): PackingSlotRow => {
        return {
            name: data.name,
            id: data.id,
            is_hidden: data.is_hidden,
            order: data.order,
            isNew: false,
        };
    });

    return processedData;
};

const Admin = async (): Promise<ReactElement> => {
    const [userData, collectionCentreData, packingSlotData] = await Promise.all([
        getUsers(),
        getCollectionCentres(),
        getPackingSlots(),
    ]);

    return (
        <main>
            <Title>Admin Panel</Title>
            <AdminPage
                userData={userData}
                collectionCentreData={collectionCentreData}
                packingSlotData={packingSlotData}
            />
        </main>
    );
};

export const metadata: Metadata = {
    title: "Admin",
};

export default Admin;
