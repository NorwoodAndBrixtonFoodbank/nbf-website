"use server";

import { FunctionsResponse } from "@supabase/functions-js/src/types";
import { AdminUserAttributes } from "@supabase/gotrue-js";
import { adminDeleteUser, DeleteUserErrorType } from "@/server/adminDeleteUser";
import { CreateUserDetails } from "@/app/admin/createUser/CreateUserForm";
import { adminCreateUser } from "@/server/adminCreateUser";
import { adminUpdateUser } from "@/server/adminUpdateUser";

// TODO VFB-23 Unpack Supabase Errors and Extract Only Relevant Fields to Return to Client

export const createUser = async (fields: CreateUserDetails): Promise<FunctionsResponse<any>> => {
    return await adminCreateUser(fields);
};

export const deleteUser = async (userId: string): Promise<DeleteUserErrorType> => {
    return await adminDeleteUser(userId);
};

export interface UpdateUserDetails {
    userId: string;
    attributes: AdminUserAttributes;
}

export const updateUser = async (
    userDetails: UpdateUserDetails
): Promise<FunctionsResponse<any>> => {
    return await adminUpdateUser(userDetails);
};
