"use client";

import { DbWikiRow } from "@/databaseUtils";
import { useState } from "react";
import DefaultWikiItemView from "@/app/info/DefaultWikiItemView";
import EditWikiItemView from "@/app/info/EditWikiItemView";

export const enterEditMode = (setEditMode: (editMode: boolean) => void): void => {
    setEditMode(true);
};

interface EditProps {
    editMode: boolean;
    row?: DbWikiRow;
}

export const EditModeDependentItem: React.FC<EditProps> = ({ editMode, row }) => {
    const [rowRef, setRowRef] = useState<DbWikiRow | undefined>(row);
    const [editModeRef, setEditModeRef] = useState(editMode);
    return (
        <>
            {!editModeRef ? (
                <DefaultWikiItemView rowRef={rowRef} setEditModeRef={setEditModeRef} />
            ) : (
                <EditWikiItemView
                    rowRef={rowRef}
                    setRowRef={setRowRef}
                    setEditModeRef={setEditModeRef}
                />
            )}
        </>
    );
};
