Lambeth Foodbank
=================

Lambeth Foodbank provides foodbank services to clients in south London that have been issued with a foodbank voucher
(by front-line professionals like social workers, doctors or police). Since the COVID-19 pandemic, most food parcels
have been delivered to clients.

## Technology stack

* Supabase for hosting the backend (PostgreSQL database, custom authentication)
* NextJS for full-stack application ('App Router')
* Styled Components for CSS (CSS-in-JS)
* Material UI for component library
* Cypress for both component unit tests and integration tests (may add Jest in the future!)
* AWS Amplify for hosting the frontend website
* AWS CloudWatch for logging errors and warnings

## Prerequisite
- You need Docker installed. The easiest way to get started is to download [Docker Desktop](https://www.docker.com/products/docker-desktop/). If you are using Windows, you may have to run `net localgroup docker-users <your_softwire_username> /ADD` as an administrator to add yourself to the docker-users group, where `<your_softwire_username>` is your non-admin Softwire username.

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
* Follow the [Update and connect to the local database](#update-and-connect-to-the-local-database) and [Apply migrations to local database](#apply-migrations-to-local-database) steps to set up the local database
* Use the output of `supabase start` to replace the details in `.env.local` so that our website can connect to the local database.

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

* Use `npx supabase functions serve` if you are receiving an errors such as "congestion zone" to run Supabase functions locally.

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
  npx supabase link --project-ref <PROJECT_ID>
  ```
  You will be prompted for the database password, which can be found in Keeper.
* Pull any new changes from the database.
  ```shell
  npx supabase db pull
  ```
* Start Supabase services on your local machine. This command will give you the "DB URL" you can use to connect to the database.
  ```shell
  npx supabase start
  ```

#### Make database changes
You can either
- Access the local Supabase console to update tables, and use
  ```shell
  npx supabase db diff -f <name_of_migration>
  ```
  to generate a migration sql file (recommended), or
- Create a migration file using
  ```shell
  npx supabase migration new <name_of_migration>
  ```
  and write sql queries yourself

#### Update the TypeScript database type definition
You can regenerate the types
- from the local database
  ```shell
  npm run db:local:generate_types
  ```
- from the deployed database
  ```shell
  npm run db:remote:generate_types -- --project-id <PROJECT_ID>
  ```
#### Create sample data in tables
- Create sample data by updating supabase/seed/seed.mts
- Login to snaplet
  ```shell
  npx snaplet auth setup
  ```
- Follow link and log in using credentials in keeper
- Regenerate assets in sync with your new database 
  ```shell
  npx snaplet generate
  ```
- If error with createSeedClient, close IDE and restart
- Then generate `supabase/seed.sql` from `supabase/seed/seed.mts`
  ```shell
  npm run db:generate_seed
  ```
- Finally put the data into the database
  ```shell
  npm run dev:reset_supabase
  ```

#### Useful commands
- `npx supabase migration list` to compare what migrations are applied locally and on remote
- `npm run dev:reset_supabase` to
  - reset the Supabase database based on the migration files and the seed data
  - create an admin user and a caller user with the following credentials:
    - admin@example.com (admin123)
    - caller@example.com (caller123)
  - upload the congestion charge postcodes to the local Supabase storage
- `npm run db:generate_seed` to generate `supabase/seed.sql` based on `supabase/seed/seed.mts`. This does not automatically put the data in the database. You'll need to run `npm run dev:reset_supabase`.

#### Useful links
- [Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Managing Environments](https://supabase.com/docs/guides/cli/managing-environments)
- [Deploy a migration](https://supabase.com/docs/guides/cli/managing-environments?environment=ci#deploy-a-migration)

## Other docs
- [Password Reset Flow](./docs/password-reset-flow.md)
- [Invite User Flow](./docs/invite-user-flow.md)
- [Release Instructions](./docs/release.md)
- [Common Problems](./docs/common-problems.md)
- [Design Choices](./docs/design-choices.md)
- [E2E Testing](./docs/e2e-testing.md)
- [Disaster Recovery Plan](./docs/disaster-recovery-plan.md)
