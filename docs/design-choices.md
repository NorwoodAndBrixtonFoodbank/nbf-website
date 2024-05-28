# Design Choices

## Do not throw errors, but return errors instead
Any operation that could fail should return an object with the desired data or the error. Here's an example function.
```ts
type SomeFunctionResult = 
    | {
        data: SomeDataType
        error: null
    } 
    | {
        data: null
        error: {
            type: SomeFunctionErrorType,
            // Add more fields here to add error info if relevant / necessary 
        }
    }

type SomeFunctionErrorType = "somethingFailed" | "anotherThingFailed"

export async function someFunction(): Promise<SomeFunctionResult> {
    // return data or error depending on what happens
}
```
This function can then be called like so:
```ts
const { data, error } = await someFunction()
if (error) {
    // handle errors
} else {
    // use data
}
```
This forces the caller of the function to explicitly deal with errors before using the data.

## NextJS design choices
* Pages are server-side
    * Any state/styled-components should be placed in the components/ folder and have a "use client" directive at the top
    * Note that the `loading.tsx` at root will be displayed if async until unblocked
    * `const metadata` should be exported with a `title:` attribute
    * Colours should be loaded from the `props.theme` in styled_components - the theme can be set in `src/app/themes.tsx`

* Testing with Cypress - for UI, opens a 'browser' and clicks buttons.
    * For both unit tests (mount a component and verify properties) as well as end-to-end tests (open the website and
      click on buttons to get to the pages you want!)

## Line endings
* We use LF line endings