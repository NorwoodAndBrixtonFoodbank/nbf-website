# Common Problems & Gotchas

## Generated db type check fails on the pipeline
- Run `npm install`. Supabase version used in the code may have changed recently.
- Make sure the workflow file for the db type check is using the same version of Supabase as the one defined in `package-lock.json`.

## Fails to create bucket when resetting database
- Try again, sometimes it can take a few times to work

## Fails to create users when resetting database
- Try again, sometimes it can take a few times to work

## Congestion charge error on console and parcels not appearing in front end parcels table
- Make sure all docker containers are running