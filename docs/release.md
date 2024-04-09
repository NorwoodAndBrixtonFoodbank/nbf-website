# Release Instructions
## Release Steps
1. Reset the `main` branch to that tag and push. This kicks off a few things
   1. Website deployment using Amplify will automatically start when the `main` branch is pushed.
   2. A pipeline asks for approval to start a dry-run of the database migration to production Supabase 
   3. A pipeline asks for approval to start the database migration to production Supabase
2. Dry-run the migration to production 
3. Confirm the website deployment has succeeded on Amplify 
4. If you're happy with the dry-run, execute the migration to production 
5. If necessary, reset the production database from the local machine
   1. This should never be done once the website actually goes live
   2. Make sure the local machine is at the latest `main` commit at this point
6. If there have been any changes in email templates, update them on production Supabase.
7. Follow the Admin Actions outlined below.


## Admin Actions
1. Create a git tag at the commit that has been deployed to production, prefixed with "v" e.g. `v0.4.0`
2. Push the tag to GitHub
3. Create a release on GitHub, comparing to the last release. You can auto-generate the release notes.
4. Create a milestone on GitHub matching the name of the release.
5. Mark relevant issues on GitHub with the milestone, and move them to UAT. 
6. Create a fix version on Jira matching the name of the release.
7. Mark relevant tickets on Jira with the fix version, and move them to UAT.
8. Release the fix version on Jira once all issues for that version are moved to Done.

