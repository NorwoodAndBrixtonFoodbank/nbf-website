import { check } from "k6";
import http from "k6/http";
import { loginEmails, loginPassword, supabaseUrl, authParams } from "./vars.js";

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
  // Trying to distribute the log in in case it's a problem with concurrent
  // users on the same account rather than just a lot of requests
  const detailsIndex = Math.floor(Math.random() * loginEmails.length);
  const authBody = {
    email: loginEmails[detailsIndex],
    gotrue_meta_security: {},
    password: loginPassword[detailsIndex]
  }

  const res = http.post(`${supabaseUrl}/auth/v1/token?grant_type=password`, JSON.stringify(authBody), authParams);

  check(res, {"wasn't redirected to login": (res) => !res.url.includes("login")});
  // Tends to fail quite a lot under small loads
  check(res, {"response code was 200": (res) => res.status == 200});
}

