# E2E Testing

## How to run tests
- Run `npm run dev -- -p 3200` to run the dev server on port 3200, where Cypress will run the tests on
- Use `npx cypress open` to open Cypress client to run specific tests and allow hot-reloads.
- You can also do `npm run build` and then `npm run test:e2e --spec=<your_test_file_path>` to run tests in the specific file
