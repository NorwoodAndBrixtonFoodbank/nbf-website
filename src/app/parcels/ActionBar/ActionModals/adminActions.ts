"use server";

import { authenticateAsAdmin, Authenticated } from "@/server/authenticateAdminUser";

export const checkUserIsAdmin = async (): Promise<Authenticated> => {
    return await authenticateAsAdmin();
};
