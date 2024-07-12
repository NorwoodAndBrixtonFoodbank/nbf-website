import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import {
    ReportsSortState,
    ReportsTableRow,
    GetReportsCountReturnType,
    GetReportsReturnType,
} from "./types";
import { Supabase } from "@/supabaseUtils";
import { DbQuery } from "@/components/Tables/Filters";
import { DbReportRow } from "@/databaseUtils";

const getReportsDataAndCount = async (
    supabase: Supabase,
    startIndex: number,
    endIndex: number,
    sortState: ReportsSortState,
    abortSignal: AbortSignal
): Promise<GetReportsReturnType> => {
    let query = supabase.from("reports").select("*") as DbQuery<DbReportRow>;

    if (sortState.sortEnabled && sortState.column.sortMethod) {
        query = sortState.column.sortMethod(sortState.sortDirection, query);
    } else {
        query.order("week_commencing", { ascending: false });
    }

    query.range(startIndex, endIndex);
    query.abortSignal(abortSignal);

    const { data: reports, error: reportsError } = (await query) as {
        data: DbReportRow[];
        error: Error | null;
    };

    if (reportsError) {
        if (abortSignal.aborted) {
            const logId = await logInfoReturnLogId("Aborted fetch: report table", {
                error: reportsError,
            });
            return { error: { type: "abortedFetchingReportsTable", logId }, data: null };
        }

        const logId = await logErrorReturnLogId("Error with fetch: reports table", {
            error: reportsError,
        });
        return { error: { type: "failedToFetchReportsTable", logId }, data: null };
    }

    const reportsData: ReportsTableRow[] = reports.map((report) => {
        return {
            weekCommencing: report.week_commencing ?? "",
            familySize1: report.family_size_1 ?? 0,
            familySize2: report.family_size_2 ?? 0,
            familySize3: report.family_size_3 ?? 0,
            familySize4: report.family_size_4 ?? 0,
            familySize5: report.family_size_5 ?? 0,
            familySize6: report.family_size_6 ?? 0,
            familySize7: report.family_size_7 ?? 0,
            familySize8: report.family_size_8 ?? 0,
            familySize9: report.family_size_9 ?? 0,
            familySize10Plus: report.family_size_10_plus ?? 0,
            total: report.total_parcels ?? 0,
            cat: report.cat ?? 0,
            dog: report.dog ?? 0,
            catAndDog: report.cat_and_dog ?? 0,
            totalWithPets: report.total_with_pets ?? 0,
        };
    });

    const { data: reportsCount, error: reportCountError } = await getReportsCount(
        supabase,
        abortSignal
    );
    if (reportCountError) {
        return { data: null, error: reportCountError };
    }

    return { error: null, data: { reportsData, count: reportsCount } };
};

const getReportsCount = async (
    supabase: Supabase,
    abortSignal: AbortSignal
): Promise<GetReportsCountReturnType> => {
    const query = supabase.from("reports").select("*", { count: "exact", head: true });

    query.abortSignal(abortSignal);

    const { count, error: reportsError } = await query;

    if (reportsError || count === null) {
        if (abortSignal.aborted) {
            const logId = await logInfoReturnLogId("Aborted fetch: report table", {
                error: reportError,
            });
            return { error: { type: "abortedFetchingReportsTableCount", logId }, data: null };
        }

        const logId = await logErrorReturnLogId("Error with fetch: reports table", {
            error: reportsError,
        });
        return { error: { type: "failedToFetchReportsTableCount", logId }, data: null };
    }

    return { error: null, data: count };
};

export default getReportsDataAndCount;
