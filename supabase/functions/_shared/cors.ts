export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const generateCorsOptionsForJsonResponse = (
    status = 200
): { headers: Record<string, string>; status: number } => ({
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
});
