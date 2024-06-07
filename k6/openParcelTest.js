import { check } from "k6";
import http from "k6/http";
import { supabaseUrl, authParams, authToken, baseUrl } from "./vars.js";

export const options = {
  thresholds: {
    // Needs tweaking
    http_req_failed: ['rate<0.01'],
    checks: ["rate==1.0"]
  },
    scenarios: {
      // Add scenarios for normal load, peak load and stress load
      average_load: {
        executor: "ramping-vus",
        stages: [
          { duration: "10s", target: 20 },
          { duration: "10s", target: 20 },
          { duration: "5s", target: 0 },
        ],
      },
    }
};

export default function () {
  // Simulate loading all parcels then opening one - I just pick a random one, may want tests for 
  // repeatedly checking the same parcel
  const parcels = http.get(`${supabaseUrl}/rest/v1/parcels_plus`, authParams);
  const parcelIds = JSON.parse(parcels.body).map(parcel => parcel.parcel_id);
  const parcelUrl = `${baseUrl}/parcels?parcelId=${parcelIds[Math.floor(Math.random() * parcelIds.length)]}`;
  
  const authTokenCookie = { cookies: { "sb-<reference id>-auth-token": authToken} }; // Replace reference ID here
  const res = http.get(parcelUrl, authTokenCookie);

  // This is mostly to check that auth works correctly
  check(res, {"wasn't redirected to login": (res) => !res.url.includes("login")});
  check(res, {"response code was 200": (res) => res.status == 200});
}


