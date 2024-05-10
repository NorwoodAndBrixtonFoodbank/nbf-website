# Disaster Recovery Plan

## Overview
A backup of the dev database is taken every hour using a GitHub workflow. See the workflow definition for the commands to generate backup files. When a disaster strikes where the dev database needs to be restored, follow this guide.

## Decrypting data backup file
The data backup file is encrypted to protect sensitive information. The encrypted backup file can be decrypted using the backup decryption repository. 

## Restoring Supabase with a backup
- Create a new Supabase project in the same organisation as the original Supabase project 
  - generate a DB password and add it to Keeper 
  - choose London as its location
- Go to Project Settings > Database (under Configuration) and find the connection string under the "PSQL" tab for the newly created project
- Restore database using the backup files, in the following order.
  ```bash
  psql -h <host> -p <port> -d <database_name> -U <user> -f <role_backup_file>
  ```
  ```bash
  psql -h <host> -p <port> -d <database_name> -U <user> -1 -f <schema_backup_file>
  ```
  ```bash
  psql -h <host> -p <port> -d <database_name> -U <user> -1 -f <data_backup_file>
  ```
- Deploy edge functions (see GitHub workflow for commands)
- Upload the congestion charge text file to bucket manually
- Update the email provider settings to match the original Supabase instance
- Update the email templates to match the original Supabase instance
- Update .env.local and add this to Keeper
- Change the environment variables on Amplify and redeploy the code.


## Other useful info
### Back up manually using Postgres
- You need PostgreSQL installed - this needs to be a version that is compatible with the Supabase instance (See Project Settings > Infrastructure on the Supabase project)
- Dump the DB into a file
  ```bash
  pg_dump -h <host> -p <port> -d <database_name> -U <user> -f <path_to_your_file>.sql --clean
  ```
