export const handleChangeFactoryDropdownList = (onChange: any): any => {
    return handleChangeFactory(onChange);
};

export const handleChangeFactoryFreeFormText = (onChange: any): any => {
    return handleChangeFactory(onChange);
};

export const handleChangeFactoryRadioGroup = (onChange: any): any => {
    return handleChangeFactory(onChange);
};

export const handleChangeFactoryCheckBox = (object: any, setObject: any): any => {
    return (event: any) => {
        setObject({
            ...object,
            [event.target.name]: event.target.checked,
        });
    };
};

export const handleChangeFactory = (onChange: any): any => {
    return (event: any) => {
        onChange((event.target as HTMLInputElement).value);
    };
};
