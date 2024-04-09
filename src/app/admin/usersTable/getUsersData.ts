import { Supabase } from "@/supabaseUtils";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import { AbortError, DatabaseError } from "@/app/errorClasses";
import { DisplayedUserRole, UserRow } from "@/app/admin/page";

export const getUsersDataAndCount = async (
    supabase: Supabase,
    startIndex: number,
    endIndex: number,
    filters: Filter<UserRow, any>[],
    sortState: SortState<UserRow>,
    abortSignal: AbortSignal
): Promise<{ userData: UserRow[]; count: number }> => {
    const userData: UserRow[] = [];
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
        const logId = abortSignal.aborted
            ? await logInfoReturnLogId("Aborted fetch: profiles table", userError)
            : await logErrorReturnLogId("Error with fetch: profiles table", userError);
        if (abortSignal.aborted) {
            throw new AbortError("fetch", "profiles table", logId);
        }

        throw new DatabaseError("fetch", "profiles table", logId);
    }

    for (const user of users) {
        userData.push({
            id: user.user_id ?? "",
            firstName: user.first_name ?? "",
            lastName: user.last_name ?? "",
            userRole: user.role ?? ("UNKNOWN" as DisplayedUserRole),
            email: user.email ?? "",
            telephoneNumber: user.telephone_number ?? "",
            createdAt: Date.parse(user.created_at ?? ""),
            updatedAt: Date.parse(user.updated_at ?? ""),
        });
    }

    const count = await getUsersCount(supabase, filters, abortSignal);

    return { userData, count };
};

const getUsersCount = async (
    supabase: Supabase,
    filters: Filter<UserRow, any>[],
    abortSignal: AbortSignal
): Promise<number> => {
    let query = supabase.from("profiles_plus").select("*", { count: "exact", head: true });

    filters.forEach((filter) => {
        if (filter.methodConfig.paginationType === PaginationType.Server) {
            query = filter.methodConfig.method(query, filter.state);
        }
    });

    query = query.abortSignal(abortSignal);

    const { count, error: userError } = await query;

    if (userError || count === null) {
        const logId = abortSignal.aborted
            ? await logInfoReturnLogId("Aborted fetch: profile table count")
            : await logErrorReturnLogId("Error with fetch: profile table count", {
                  error: userError,
              });
        if (abortSignal.aborted) {
            throw new AbortError("fetch", "profile table", "logId");
        }

        throw new DatabaseError("fetch", "profile table", logId);
    }

    return count;
};
