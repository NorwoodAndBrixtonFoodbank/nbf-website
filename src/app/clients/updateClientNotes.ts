import { logErrorReturnLogId } from "@/logger/logger";
import { sendAuditLog } from "@/server/auditLog";
import supabase from "@/supabaseClient";

type UpdateClientNotesResponse =
    | { error: null }
    | { error: { type: "updateNotesFailed"; logId: string } };

export const updateClientNotes = async (
    clientId: string,
    notes: string | null
): Promise<UpdateClientNotesResponse> => {
    const baseAuditLogProps = {
        action: "update client notes",
        clientId,
        content: { notes: notes, clientId },
    };

    const { error } = await supabase
        .from("clients")
        .update({ notes: notes })
        .eq("primary_key", clientId);

    if (error) {
        const logId = await logErrorReturnLogId("update client notes failed", { error });
        await sendAuditLog({ ...baseAuditLogProps, wasSuccess: false, logId });
        return { error: { type: "updateNotesFailed", logId } };
    }

    await sendAuditLog({ ...baseAuditLogProps, wasSuccess: true });
    return { error: null };
};
