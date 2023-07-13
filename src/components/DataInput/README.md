# Data Input Components
The following document contains information on how to use the input handler factories for each of the implemented data input components:

* `<FreeFormTextInput />`
* `<RadioGroupInput />`
* `<DropdownListInput />`
* `<CheckboxInput />`

Each component has an `onChange` prop used to handle change events on the values of the input component *e.g.* when someone clicks an option on a dropdown list. 

## Input Handler Factories
For most use cases, the event handler function passed to the `onChange` prop will be used to set the value of some state variable in the parent component.

As such, a set of factory functions have been provided to generate event handlers for each input component for this use case.
The provided factory functions are as follows:

* `getFreeFormTextHandler(setValue)`
* `getRadioGroupHandler(setValue)`
* `getDropdownListHandler(setValue)`
* `getCheckboxHandler(setBoolean)`

For example, in changing a state variable `bool` using a `<CheckboxInput />` component, the event handler `getCheckboxHandler` may be used in the following manner:
    
`const [bool, setBool] = useState(false);`

    <CheckboxInput label="Option 1" onChange={getCheckboxHandler(setBool)} />
\
Similarly, for a `<DropdownListInput />` component:

`const [selectedValue, setSelectedValue] = useState("");`

    <DropdownListInput
        labelsAndValues={[
            ["Option 1", "value_1"],
            ["Option 2", "value_2"],
            ["Option 3", "value_3"],
        ]}
        listTitle="w"
        onChange={getDropdownListHandler(setSelectedValue)}
    />


