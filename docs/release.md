# Release Instructions
## Release Steps
1. Reset the `main` branch to that tag and push. 
   ```
   git checkout main
   git pull
   git reset --hard dev
   git push
   ```
   This kicks off a few things
   1. Website deployment using Amplify will automatically start when the `main` branch is pushed.
   2. A pipeline asks for approval to start a dry-run of the database migration to production Supabase 
   3. A pipeline asks for approval to start the database migration to production Supabase
2. Approve the migration dry-run to production 
3. Confirm the website deployment has succeeded on Amplify 
4. If you're happy with the dry-run, execute the migration to production 
   - It may be worth checking the order of the files and cross reference it with the commits
   - Also look at what the migrations are doing to ensure there's no conflicts/the declaration you want is defined last
5. If necessary, reset the production database from the local machine
   1. This should never be done once the website actually goes live
   2. Make sure the local machine is at the latest `main` commit at this point
6. If there have been any changes in email templates, update them on production Supabase (Navbar on the left -> Authentication -> Email templates)
   1. Update the email subjects
   2. Update the email content
7. Follow the Admin Actions outlined below.

## Admin Actions
1. Create a git tag at the commit that has been deployed to production, prefixed with "v" e.g. `v0.4.0`
   ```
   git tag "v<version_number>"          // e.g. git tag "v0.4.0"
   ```
2. Push the tag to GitHub
   ```
   git push origin "v<version_number>"  // e.g. git push origin "v0.4.0"
   ```
3. Create a release on GitHub, comparing to the last release. You can auto-generate the release notes.
4. Move all the tickets in UAT to done on both Jira and GitHub (make sure there's no comments saying that the ticket failed the testing and needs to be moved back to in progress/needs a new ticket created)
5. Create a milestone on GitHub matching the name of the release (Issues -> Milestones -> New milestone)
6. Mark relevant issues on GitHub (Release column) with the milestone, and move them to UAT. 
7. Create a fix version on Jira matching the name of the release (Navbar on the left -> Releases -> Create version (NOTE: this needs admin permissions))
8. Mark relevant tickets on Jira (Release column) with the fix version, and move them to UAT.
9. Release the fix version on Jira once all issues for that version are moved to Done.

