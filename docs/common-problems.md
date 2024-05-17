# Common Problems & Gotchas

## Generated db type check fails on the pipeline
- Run `npm install`. Supabase version used in the code may have changed recently.
- Make sure the workflow file for the db type check is using the same version of Supabase as the one defined in `package-lock.json`.

## E2E tests fails locally but not on the pipeline
- Some tests modify the database and may fail if repeatedly run
- Tests need to be run on fresh data
- To resolve this run
  `npm post_checkout; npm run build; npm run test:e2e`

## Tests failing on github: Failed to start supabase container
- You may get a failed Start local Supabase instance:
```failed to start docker container: Error response from daemon: driver failed programming external connectivity on endpoint supabase_db_vauxhall-foodbank ```
- Sometimes this can happen and usually works on re-run of the test
