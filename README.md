Vauxhall Foodbank
=================

Vauxhall Foodbank provides foodbank services to clients in south London that have been issued with a foodbank voucher
(by front-line professionals like social workers, doctors or police). Since the COVID-19 pandemic, most food parcels
have been delivered to clients. See [their website](https://vauxhall.foodbank.org.uk/) for information.

## Technology stack

* Supabase for hosting (PostgreSQL database, custom authentication)
* NextJS for full-stack application ('App Router')
* Styled Components for CSS (CSS-in-JS)
* Material UI for component library
* Cypress for both component unit tests and integration tests (may add Jest in the future!)

## Development

### First time setup 

* Download .env.local from Keeper and put in the top-level directory

* Use `npm install` to install any dependencies.

* If you're using WSL, you need to download some dependencies for Cypress:
```shell
sudo apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

* Run website locally (`npm run dev`) and try to log in with the Test User (see Keeper) to verify it all works!
  * Note that the login page can be slightly flaky, but if it doesn't immediately error then it should be signed in!
    Pressing any of the navigation bar buttons will not then redirect you to the login page.

* The best place to start is `src/app`, where the website is based! Look at the folder structure for an idea of what the
  website navigation will be.

* (Optional) Install 'axe DevTools' to check that the website is accessible:
  https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?utm_source=deque.com&utm_medium=referral&utm_campaign=axe_hero

### Helpful commands

* Use `npm run dev` to launch the website locally
    * This has hot-reloading, so will update every time you save any TypeScript document.

* Use `npm run lint_fix` to get ESLint to try and fix any linting mistakes, and to report anything it cannot fix.

* Use `npm run build` to make an optimised build - you'll need to do this before running tests.

* Use `npm run test` to run all tests. This will run both component and integration tests (which will stop if any fail).
  * Can single out test suites with:
    * `npm run test:component` for just component (unit) tests
    * `npm run test:e2e` for just end-to-end tests
    * `npm run test:coverage` for a full coverage report at the end
  * Can open the Cypress UI to see individual results with `npm run open:cypress`

### Supabase development

To use the Supabase CLI:
* You'll need to have created a personal access token in Supabase and run `supabase login`
* For many supabase features you'll need to have Docker Desktop running
* Run the commands as `supabase [...]`

### Database
Database migrations are tracked under /supabase/migrations.

#### Update and connect to the local database
* Select the database to pull from. This will be our deployed dev database. 
  ```shell
  supabase link --project-ref <PROJECT_ID>
  ```
* Pull any new changes from the database.
  ```shell
  supabase pull
  ```
* Start Supabase services on your local machine. This command will give you the "DB URL" you can use to connect to the database.
  ```shell
  supabase start
  supabase functions serve
  ```

#### Update the TypeScript database type definition
You can regenerate the types
- from the local database
  ```shell
  supabase gen types typescript --local --schema public > src/databaseTypesFile.ts
  ```
- from the deployed database
  ```shell
  supabase gen types typescript --project-id <PROJECT_ID> --schema public > src/databaseTypesFile.ts
  ```
  
#### Make database changes
You can either
- Access the local Supabase console to update tables, and use 
  ```shell
  supabase db diff > supabase/migrations/<date_time_and_name_of_migration>.sql
  ```
  to generate a migration sql file, or
- Create a migration file using 
  ```shell
  supabase migration new <name_of_migration>
  ```
  and write sql queries yourself

#### Apply migrations to local database
Ensure you have all the migration files saved in `supabase/migrations` and run
```bash
supabase db reset
```

#### Apply migrations to deployed database
Migrations aren't currently integrated into the CI pipeline, so need to be applied manually to other environments when promoting changes. To apply manually:
* Run `supabase link --project-ref <PROJECT_ID>` to select the target database
* Run `supabase db pull` to capture any changes required for the local database to catch up with the deployed database 
* `supbase db push` to apply outstanding migrations

To check they've been applied correctly, either:
* `supabase db diff --linked` to run against the linked deployed database
* `supabase db diff` to run against the local database
* `supabase migration list` on both dev and target databases can be compared

#### Seed the local database
The local database is generated based on the code in `seed.mts`. This uses Snaplet to generate a large amount of data.
To generate te SQL queries needed to populate database, run
```shell
npx tsx seed.mts > supabase/seed.sql
```
To rebuild the database from the migration files and `seed.sql`, run
```shell
supabase db reset
```

#### Useful links
- [Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Managing Environments](https://supabase.com/docs/guides/cli/managing-environments)
- [Deploy a migration](https://supabase.com/docs/guides/cli/managing-environments?environment=ci#deploy-a-migration)

## NextJS design choices

* Functional arrow components

* Pages are server-side
  * Any state/styled-components should be placed in the components/ folder and have a "use client" directive at the top
  * Note that the `loading.tsx` at root will be displayed if async until unblocked
  * `const metadata` should be exported with a `title:` attribute
  * Colours should be loaded from the `props.theme` in styled_components - the theme can be set in `src/app/themes.tsx`

* Testing with Cypress - for UI, opens a 'browser' and clicks buttons.
  * For both unit tests (mount a component and verify properties) as well as end-to-end tests (open the website and
    click on buttons to get to the pages you want!)
