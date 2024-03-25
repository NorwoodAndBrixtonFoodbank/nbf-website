## What's changed
REPLACE_THIS_LINE

## Screenshots / Videos
| Before     | After      |
|------------|------------|
| paste_here | paste_here |

## Checklist
- [ ] The ticket is up-to-date - Please document any deviations from the original approach if there is any.
- [ ] I have documented the testing steps for QA
- [ ] I have self-reviewed this PR
- [ ] Make sure you've verified it works via `npm run dev`
- [ ] Make sure you've verified it works via `npm run build` and `npm run start`
- [ ] Make sure you've fixed all linting problems with `npm run lint_fix`
- [ ] Make sure you've tested via `npm run test:e2e`

If you have made any changes to the database...
  - [ ] The migration files are up-to-date with my final set up (`npx supabase db diff -f <name_of_migration>` should create nothing at this point)
  - [ ] I have updated the typescript definitions for the database with `db:local:generate_types`
  - [ ] I have modified the seed in `seed.mts` if appropriate
  - [ ] If I have modified the seed, I have also generated the seed with `npm run db:generate_seed` 
  - [ ] With my final set up, I can run `npm run dev:reset_supabase` without any errors.
  - Does this require resetting the deployed database? - YES / NO (remove as appropriate)
