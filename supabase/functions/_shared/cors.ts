export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const generateCorsOptionsForJsonResponse = (status: number = 200): any => ({
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
});
