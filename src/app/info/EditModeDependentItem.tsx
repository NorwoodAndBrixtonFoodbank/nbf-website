"use client";

import { DbWikiRow } from "@/databaseUtils";
import { useState } from "react";
import WikiItemDisplay from "@/app/info/WikiItemDisplay";
import WikiItemEdit from "@/app/info/WikiItemEdit";
import AdminManagerDependentView from "@/app/info/AdminManagerDependentView";

interface EditProps {
    row?: DbWikiRow;
    appendNewRow: (newRow: DbWikiRow, index: number) => void;
    removeRow: (row: DbWikiRow) => number;
}

const EditModeDependentItem: React.FC<EditProps> = ({ row, appendNewRow, removeRow }) => {
    const [rowData, setrowData] = useState<DbWikiRow | undefined>(row);
    const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
    return (
        <>
            {rowData &&
                (isInEditMode || (rowData.title === "" && rowData.content === "") ? (
                    <AdminManagerDependentView>
                        <WikiItemEdit
                            rowData={rowData}
                            setRowData={setrowData}
                            setIsInEditMode={setIsInEditMode}
                            appendNewRow={appendNewRow}
                            removeRow={removeRow}
                        />
                    </AdminManagerDependentView>
                ) : (
                    <WikiItemDisplay
                        rowData={rowData}
                        openEditMode={() => {
                            setIsInEditMode(true);
                        }}
                    />
                ))}
        </>
    );
};

export default EditModeDependentItem;
