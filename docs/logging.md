# Logging

We have two main types of logging: system logging and audit logging.

## System Logs
- We use [Winston](https://github.com/winstonjs/winston) for system logging, sending the logs to both the console and
cloudwatch
- This is done with server functions to avoid having cloudwatch secrets in the client bundle
- This logging is managed by the functions in `src/utils/logger.ts`
- During local development, logs will be printed to the console in your IDE. if you insert console logs into your code
it will either appear in your IDE or browser console depending on whether the code is client side or server side.

## Audit Logs
- Audit logs are how we track database changes for accountability purposes.
- They exist in the `audit_logs` table in the database.

## Error Box Messages
- This is another way of showing errors to the developers.
- The error box messages are shown in the bottom left corner of the web page.
- Note that the error box messages are unhandled errors that are caught by the error boundary.
