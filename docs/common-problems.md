# Common Problems & Gotchas

## Generated db type check fails on the pipeline
- Run `npm install`. Supabase version used in the code may have changed recently.
- Make sure the workflow file for the db type check is using the same version of Supabase as the one defined in `package-lock.json`.
