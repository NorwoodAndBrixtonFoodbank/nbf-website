"use client";

import { DbWikiRow } from "@/databaseUtils";
import { useState } from "react";
import WikiItemDisplay from "@/app/info/WikiItemDisplay";
import WikiItemEdit from "@/app/info/WikiItemEdit";
import AdminManagerDependentView from "@/app/info/AdminManagerDependentView";
import { useRouter } from "next/navigation";

export const enterEditMode = (setIsInEditMode: (isInEditMode: boolean) => void): void => {
    setIsInEditMode(true);
};

interface EditProps {
    row?: DbWikiRow;
    rows: DbWikiRow[]
}

const EditModeDependentItem: React.FC<EditProps> = ({ row, rows}) => {
    const [rowData, setrowData] = useState<DbWikiRow | undefined>(row);
    const [isInEditMode, setIsInEditMode] = useState(false);
    return (
        <>
            {rowData !== undefined && 
                (isInEditMode || (rowData.title === '' &&  rowData.content === '')? (
                    <AdminManagerDependentView>
                        <WikiItemEdit
                            rowData={rowData}
                            setRowData={setrowData}
                            setIsInEditMode={setIsInEditMode}
                            rows={rows}
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