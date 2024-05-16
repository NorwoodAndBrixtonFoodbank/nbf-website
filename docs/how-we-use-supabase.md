# How We Use Supabase

### Supabase console
You can access the local Supabase console at localhost:54323 which allows you to view and edit your local database.

### Tables
Some tables are managed by us; these are in the public schema.
Some tables are managed by Supabase, importantly, `auth.users`, which deals with the users table.

### Views
We use views to combine data from multiple tables or perform calculations on them. They are automatically updated when the tables they pull from update.
Views make it easier for us to display data in the front end using server side paginated tables, as it is easy to filter and sort by the columns we want to.

### Edge Functions
These are TypeScript functions that Supabase hosts for us. They are seperate from the database. 
We use them to check for congestion charges by postcode.

### Triggers
Find in the database tab in the Supabase console.
These are functions which run whenever a particular table is updated.

### Functions
Find in the database tab in the Supabase console.
We can call them in the front end using `supabase.rpc(FUNCTION_NAME, PARAMS)`.
They are particularly useful for when we want to perform multiple operations together and each may cause an error. 
If we put these operations in a Supabase function, if any of them result in an error, Supabase automatically reverts the changes from the other operations in the function, or does not carry them out.

### Roles
Find in the database tab in the Supabase console.
These are seperate from our website user roles (volunteer, admin, etc) and are managed by supabase. We're interested in anon and authenticated.

### Migrations
Find in the database tab in the Supabase console, but may be easier to access in supabase/migrations.
When we reset the database, all of the migration files run in order.
When we push to a live site, only outstanding migration files run.

### Enumerated Types
Find in the database tab in the Supabase console.
Supabase allows us to manage our own enums. We can set column data types to be these enums.

### Authentication Policies
Find in the authentication tab in the Supabase console.
The policies control what is possible for users to do, including restricting access by roles.
See https://supabase.com/docs/guides/database/postgres/row-level-security

### Realtime
This controls whether or not it is possible to subscribe to a table from the front end.
Subscribing means it is possible for us to refetch data automatically, whenever it changes.