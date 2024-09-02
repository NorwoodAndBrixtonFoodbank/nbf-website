# Common Problems & Gotchas

### Generated db type check fails on the pipeline
- Run `npm install`. Supabase version used in the code may have changed recently.
- Make sure the workflow file for the db type check is using the same version of Supabase as the one defined in `package-lock.json`.

### Fails to create bucket when resetting database
- Try again, sometimes it can take a few times to work

### Fails to create users when resetting database
- Try again, sometimes it can take a few times to work

### Login button does nothing after running post_checkout
- Refresh the page. This might be due to your browser caching the old session, which is no longer recognised when supabase restarts.

### Congestion charge error on console and parcels not appearing in front end parcels table
- Make sure all docker containers are running
- Run `npx supabase functions serve` to ensure the edge functions are running

### Any kind of error to do with the data showing up on the website
- It's possible you forgot to run `npm run post_checkout` and thus the front end may be incompatible with the back end.

### Failed to fetch error on attempting to log into website
- Make sure all docker containers are running; if not, start them
- If they already were running or the above doesn't work, then run `npm run post_checkout` and `npm run dev`

### Component tests failing
- Known issue
- Cypress component tests don't cope with server components / server actions on Next.js currently

### E2E tests fail locally but not on the pipeline
- Some tests modify the database and may fail if repeatedly run
- Tests need to be run on fresh data
- To resolve this run `npm post_checkout; npm run build; npm run test:e2e`

### Tests failing on GitHub: Failed to start Supabase container
- You may get a failed Start local Supabase instance:
```failed to start docker container: Error response from daemon: driver failed programming external connectivity on endpoint supabase_db_vauxhall-foodbank ```
- Sometimes this can happen and usually works on re-run of the test

### Module '"@snaplet/seed"' has no exported member 'createSeedClient' and other TS errors with Snaplet
- Run `npx snaplet generate`
- Reload your IDE window
