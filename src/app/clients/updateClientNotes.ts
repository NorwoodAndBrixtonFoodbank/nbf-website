import { logErrorReturnLogId } from "@/logger/logger";
import supabase from "@/supabaseClient";

type UpdateClientNotesResponse =
    | { error: null }
    | { error: { type: "updateNotesFailed"; logId: string } };

export const updateClientNotes = async (
    clientId: string,
    notes: string | null
): Promise<UpdateClientNotesResponse> => {
    const { error } = await supabase
        .from("clients")
        .update({ notes: notes })
        .eq("primary_key", clientId);
    if (error) {
        const logId = await logErrorReturnLogId("update client notes failed", { error });
        return { error: { type: "updateNotesFailed", logId } };
    }
    //aduit log
    return { error: null };
};
