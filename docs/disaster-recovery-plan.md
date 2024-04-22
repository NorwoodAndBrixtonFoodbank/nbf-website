## Prerequisite
- PostgreSQL - this needs to be a version that is compatible with the Supabase instance (See Project Settings > Infrastructure on the Supabase project)

## Back up
- Dump the DB into a file 
  ```bash
  pg_dump -h <host> -p <port> -d <database_name> -U <user> -f <path_to_your_file>.sql --clean
  ```

## Restoring Supabase with a backup

### On a brand new Supabase project
- Create a new supabase project in the same organisation 
  - choose db password and store in keeper 
  - choose london  
- Go to Project Settings > Database (under Configuration) and find the connection string under the "PSQL" tab for the newly created project
- Restore database using the backup
  ```bash
  psql -h <host> -p <port> -d <database_name> -U <user> -f <path_to_your_file>.sql
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
