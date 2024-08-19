# Data Input Components
The following document contains information on how to use the input handler factories for each of the implemented data input components:

* `<FreeFormTextInput />`
* `<RadioGroupInput />`
* `<ControlledSelect />`
* `<UncontrolledSelect />`
* `<CheckboxInput />`

Each component has an `onChange` prop used to handle change events on the values of the input component -  for example, when someone clicks an option on a dropdown list. 

## Input Handler Factories
For most use cases, the event handler function passed to the `onChange` prop will be used to set the value of some state variable in the parent component.

As such, a set of factory functions have been provided to generate event handlers for each input component for this use case.
The provided factory functions are as follows:

* `getFreeFormTextHandler(setValue)`
* `getRadioGroupHandler(setValue)`
* `getDropdownListHandler(setValue)`
* `getCheckboxHandler(setBoolean)`

For example, in changing a state variable `bool` using a `<CheckboxInput />` component, the event handler `getCheckboxHandler` may be used in the following manner:

```typescript jsx
const [bool, setBool] = useState(false);
```

```typescript jsx
<CheckboxInput label="Option 1" onChange={getCheckboxHandler(setBool)} />
````

\
Similarly, for a `<UncontrolledSelect />` or a `<ControlledSelect />` component:

```typescript jsx
const [selectedValue, setSelectedValue] = useState("");
```

\
Note that a `<UncontrolledSelect />` component takes in defaultValue, as it is a one-way implementation.

```typescript jsx
<UncontrolledSelect
    listTitle="w"
    defaultValue="value_1"
    onChange={getDropdownListHandler(setSelectedValue)}
/>
```

\
For a `<ControlledSelect />` component, the argument takes in value instead of defaultValue. The value prop is used to set the display value of the dropdown list.

```typescript jsx
<ControlledSelect
    listTitle="w"
    value="value_1"
    onChange={getDropdownListHandler(setSelectedValue)}
/>
```


