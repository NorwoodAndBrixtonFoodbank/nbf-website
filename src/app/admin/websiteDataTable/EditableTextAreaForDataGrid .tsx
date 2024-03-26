import { GridRenderEditCellParams, GridRowId } from "@mui/x-data-grid";
import React, { useEffect, useLayoutEffect, useRef } from "react";

interface EditableTextAreaForDataGridProps extends GridRenderEditCellParams {
    editMode: boolean;
    handleValueChange: (value: string, id: GridRowId, field: string) => void;
}

const EditableTextAreaForDataGrid: React.FC<EditableTextAreaForDataGridProps> = ({
    id,
    field,
    hasFocus,
    value,
    editMode,
    handleValueChange,
}: EditableTextAreaForDataGridProps) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const initialValue = useRef(value);

    useEffect(() => {
        initialValue.current = value;
    }, [value]);

    useLayoutEffect(() => {
        if (hasFocus && ref.current) {
            ref.current.focus();
            ref.current.setSelectionRange(initialValue.current.length, initialValue.current.length);
        }
    }, [hasFocus, initialValue]);

    return (
        <textarea
            value={value}
            onChange={(event) => handleValueChange(event.target.value, id, field)}
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
