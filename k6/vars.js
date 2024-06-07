// I couldn't find a way to pass in .env variable - only passing --env VARIABLE=value through command line 
// so I put them there for now 

export const supabaseUrl = "<url>"; // Supabase -> Project settings -> API -> Project URL
export const authParams = {
  headers: { 
    "apikey": "<api key>",
    "Authorization": "Bearer <api key>" //  Supabase -> Project settings -> API -> Project API keys
  }
};
export const authToken = "<sb-<reference ID>-auth-token>"; // Log in to the app and in dev tools -> cookies copy the full value of auth-token cookie
export const baseUrl = "<url>"; // Main URL of the site, e.g. from Amplify
export const loginEmails = ["", "", ""];
export const loginPassword = ["", "", ""];
