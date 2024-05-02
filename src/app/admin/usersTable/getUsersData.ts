import { Supabase } from "@/supabaseUtils";
import { PaginationType } from "@/components/Tables/Filters";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import {
    UsersFilter,
    UsersSortState,
    GetUsersReturnType,
    GetUserCountReturnType,
    UserRow,
} from "./types";

export const getUsersDataAndCount = async (
    supabase: Supabase,
    startIndex: number,
    endIndex: number,
    filters: UsersFilter[],
    sortState: UsersSortState,
    abortSignal: AbortSignal
): Promise<GetUsersReturnType> => {
    let query = supabase.from("users_plus").select("*");

    if (
        sortState.sortEnabled &&
        sortState.column.sortMethodConfig?.paginationType === PaginationType.Server
    ) {
        query = sortState.column.sortMethodConfig.method(query, sortState.sortDirection);
    } else {
        query = query.order("first_name");
    }
    query = getQueryWithFiltersApplied(query, filters);

    query = query.range(startIndex, endIndex);

    query = query.abortSignal(abortSignal);

    const { data: users, error: userError } = await query;

    if (userError) {
        if (abortSignal.aborted) {
            const logId = await logInfoReturnLogId("Aborted fetch: profiles table", {
                error: userError,
            });
            return { error: { type: "abortedFetchingProfilesTable", logId }, data: null };
        }

        const logId = await logErrorReturnLogId("Error with fetch: profiles table", {
            error: userError,
        });
        return { error: { type: "failedToFetchProfilesTable", logId }, data: null };
    }

    const userData: UserRow[] = users.map((user) => {
        return {
            userId: user.user_id ?? "",
            profileId: user.profile_id ?? "",
            firstName: user.first_name ?? "",
            lastName: user.last_name ?? "",
            userRole: user.role ?? "UNKNOWN",
            email: user.email ?? "",
            telephoneNumber: user.telephone_number ?? "-",
            createdAt: user.created_at ? Date.parse(user.created_at) : null,
            updatedAt: user.updated_at ? Date.parse(user.updated_at) : null,
        };
    });

    const { data: userCount, error: userCountError } = await getUsersCount(
        supabase,
        filters,
        abortSignal
    );
    if (userCountError) {
        return { data: null, error: userCountError };
    }

    return { error: null, data: { userData, count: userCount } };
};

const getUsersCount = async (
    supabase: Supabase,
    filters: UsersFilter[],
    abortSignal: AbortSignal
): Promise<GetUserCountReturnType> => {
    let query = supabase.from("users_plus").select("*", { count: "exact", head: true });

    query = getQueryWithFiltersApplied(query, filters);

    query = query.abortSignal(abortSignal);

    const { count, error: userError } = await query;

    if (userError || count === null) {
        if (abortSignal.aborted) {
            const logId = await logInfoReturnLogId("Aborted fetch: profile table count");
            return { error: { type: "abortedFetchingProfilesTableCount", logId }, data: null };
        }

        const logId = await logErrorReturnLogId("Error with fetch: profile table count", {
            error: userError,
        });
        return { error: { type: "failedToFetchProfilesTableCount", logId }, data: null };
    }

    return { error: null, data: count };
};

function getQueryWithFiltersApplied(
    originalQuery: PostgrestFilterBuilder<Database["public"], any, any>,
    filters: UsersFilter[]
): PostgrestFilterBuilder<Database["public"], any, any> {
    let query = originalQuery;

    filters.forEach((filter) => {
            query = filter.method(query, filter.state);
    });

    return query;
}
