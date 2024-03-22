import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface CustomCellProps extends GridRenderEditCellParams {
    editMode: boolean;
}

const CustomComponent: React.FC<CustomCellProps> = (props: CustomCellProps) => {
    const { id, field, hasFocus } = props;
    const apiRef = useGridApiContext();
    const ref = useRef<HTMLTextAreaElement>(null);
    const initialValue = useRef(props.value);
    const [value, setValue] = useState<string>(props.value);

    console.log(initialValue, value);

    useEffect(() => {
        initialValue.current = props.value;
        setValue(props.value);
    }, [props.value]);

    useLayoutEffect(() => {
        if (hasFocus) {
            ref.current?.focus();
            ref.current?.setSelectionRange(
                initialValue.current.length,
                initialValue.current.length
            );
        }
    }, [hasFocus, initialValue]);

    const handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const newValue = event.target.value;
        setValue(newValue);
        apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    return (
        <textarea
            value={value}
            onChange={handleValueChange}
            ref={ref}
            style={{
                flex: 3,
                resize: "none",
                height: 150,
                borderWidth: 0,
                paddingTop: 10,
                backgroundColor: "transparent",
            }}
            onBlur={() => {
                ref.current?.setSelectionRange(value.length, value.length);
            }}
            readOnly={!props.editMode}
        />
    );
};

export default CustomComponent;
