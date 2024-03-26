import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface EditableTextAreaForDataGridProps extends GridRenderEditCellParams {
    editMode: boolean;
}

const EditableTextAreaForDataGrid: React.FC<EditableTextAreaForDataGridProps> = ({
    id,
    field,
    hasFocus,
    value: propsValue,
    editMode,
}: EditableTextAreaForDataGridProps) => {
    const apiRef = useGridApiContext();
    const ref = useRef<HTMLTextAreaElement>(null);
    const initialValue = useRef(propsValue);
    const [value, setValue] = useState<string>(propsValue);

    useEffect(() => {
        initialValue.current = propsValue;
        setValue(propsValue);
    }, [propsValue]);

    useLayoutEffect(() => {
        if (hasFocus && ref.current) {
            ref.current.focus();
            ref.current.setSelectionRange(initialValue.current.length, initialValue.current.length);
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
            readOnly={!editMode}
        />
    );
};

export default EditableTextAreaForDataGrid;
