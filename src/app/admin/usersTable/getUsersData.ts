import { Supabase } from "@/supabaseUtils";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import { AbortError, DatabaseError } from "@/app/errorClasses";
import { DisplayedUserRole, UserRow } from "@/app/admin/page";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";

export const getUsersDataAndCount = async (
    supabase: Supabase,
    startIndex: number,
    endIndex: number,
    filters: Filter<UserRow, any>[],
    sortState: SortState<UserRow>,
    abortSignal: AbortSignal
): Promise<{ userData: UserRow[]; count: number }> => {
    let query = supabase.from("profiles_plus").select("*");

    if (
        sortState.sortEnabled &&
        sortState.column.sortMethodConfig?.paginationType === PaginationType.Server
    ) {
        query = sortState.column.sortMethodConfig.method(query, sortState.sortDirection);
    } else {
        query = query.order("first_name");
    }
    filters.forEach((filter) => {
        if (filter.methodConfig.paginationType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    query = query.range(startIndex, endIndex);

    query = query.abortSignal(abortSignal);

    const { data: users, error: userError } = await query;

    if (userError) {
        if (abortSignal.aborted) {
            const logId = await logInfoReturnLogId("Aborted fetch: profiles table", {
                error: userError,
            });
            throw new AbortError("fetch", "profiles table", logId);
        }

        const logId = await logErrorReturnLogId("Error with fetch: profiles table", {
            error: userError,
        });
        throw new DatabaseError("fetch", "profiles table", logId);
    }

    const userData: UserRow[] = users.map((user) => {
        return {
            id: user.user_id ?? "",
            firstName: user.first_name ?? "",
            lastName: user.last_name ?? "",
            userRole: user.role ?? ("UNKNOWN" as DisplayedUserRole),
            email: user.email ?? "",
            telephoneNumber: user.telephone_number ?? "",
            createdAt: Date.parse(user.created_at ?? ""),
            updatedAt: Date.parse(user.updated_at ?? ""),
        };
    });

    const count = await getUsersCount(supabase, filters, abortSignal);

    return { userData, count };
};

function getQueryWithFiltersApplied(
    originalQuery: PostgrestFilterBuilder<Database["public"], any, any>,
    filters: Filter<UserRow, any>[]
): PostgrestFilterBuilder<Database["public"], any, any> {
    let query = originalQuery;

    filters.forEach((filter) => {
        if (filter.methodConfig.paginationType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    return query;
}

const getUsersCount = async (
    supabase: Supabase,
    filters: Filter<UserRow, any>[],
    abortSignal: AbortSignal
): Promise<number> => {
    let query = supabase.from("profiles_plus").select("*", { count: "exact", head: true });

    query = getQueryWithFiltersApplied(query, filters);
    filters.forEach((filter) => {
        if (filter.methodConfig.paginationType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    query = query.abortSignal(abortSignal);

    const { count, error: userError } = await query;

    if (userError || count === null) {
        if (abortSignal.aborted) {
            const logId = await logInfoReturnLogId("Aborted fetch: profile table count");
            throw new AbortError("fetch", "profile table", logId);
        }

        const logId = await logErrorReturnLogId("Error with fetch: profile table count", {
            error: userError,
        });
        throw new DatabaseError("fetch", "profile table", logId);
    }

    return count;
};
