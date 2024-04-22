## Prerequisite
  
## Make a backup (Supabase way)
- Link to the project you want a backup for
  ```bash
  npx supabase link
  ```
- Dump the database into backup files using the following three commands
  - Schema
    ```bash
    npx supabase db dump -f supabase/schema.sql
    ```
  - Database roles
    ```bash
    npx supabase db dump --role-only -f supabase/role.sql
    ```
  - Data
    ```bash
    npx supabase db dump --data-only -f supabase/data.sql
    ```

## Restoring Supabase with a backup

### On a brand new Supabase project
- Create a new supabase project in the same organisation 
  - choose db password and store in keeper 
  - choose london  
- Go to Project Settings > Database (under Configuration) and find the connection string under the "PSQL" tab for the newly created project
- Restore database using the backup files, in the following order.
  ```bash
  psql -h <host> -p <port> -d <database_name> -U <user> -f supabase/role.sql
  ```
  ```bash
  psql -h <host> -p <port> -d <database_name> -U <user> -1 -f supabase/schema.sql
  ```
  ```bash
  psql -h <host> -p <port> -d <database_name> -U <user> -1 -f supabase/data.sql
  ```
- Deploy edge functions (see github workflow for commands)
- Upload the congestion charge text file to bucket manually

email provider set up?
email tempaltes
update env variables and update keeper
change env variables and deploy frontend


### On an existing Supabase project
- Go to Project Settings > Database (under Configuration) and find the connection string under the "PSQL" tab for the project
- Restore database using the backup
  ```bash
  psql -h <host> -p <port> -d <database_name> -U <user> -f <path_to_your_file>.sql
  ```


## Back up (using Postgres)
- You need PostgreSQL installed - this needs to be a version that is compatible with the Supabase instance (See Project Settings > Infrastructure on the Supabase project)
- Dump the DB into a file
  ```bash
  pg_dump -h <host> -p <port> -d <database_name> -U <user> -f <path_to_your_file>.sql --clean
  ```
