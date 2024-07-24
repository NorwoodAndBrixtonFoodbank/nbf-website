"use client";

import { DbWikiRow } from "@/databaseUtils";
import { useState } from "react";
import WikiItemDisplay from "@/app/info/WikiItemDisplay";
import WikiItemEdit from "@/app/info/WikiItemEdit";
import AdminManagerDependent from "./AdminManagerDependent";

export const enterEditMode = (setIsInEditMode: (isInEditMode: boolean) => void): void => {
    setIsInEditMode(true);
};

interface EditProps {
    row?: DbWikiRow;
}

export const EditModeDependentItem: React.FC<EditProps> = ({ row }) => {
    const [rowData, setrowData] = useState<DbWikiRow | undefined>(row);
    const [isInEditMode, setIsInEditMode] = useState(false);
    return (
        <>
            {rowData &&
                (isInEditMode ? (
                    <AdminManagerDependent>
                        <WikiItemEdit
                            rowData={rowData}
                            setRowData={setrowData}
                            setIsInEditMode={setIsInEditMode}
                        />
                    </AdminManagerDependent>
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
