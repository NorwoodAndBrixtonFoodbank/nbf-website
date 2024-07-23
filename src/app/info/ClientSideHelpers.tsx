"use client";

import { DbWikiRow } from "@/databaseUtils";
import { useState } from "react";
import DefaultWikiItemView from "@/app/info/DefaultWikiItemView";
import EditWikiItemView from "@/app/info/EditWikiItemView";

export const enterEditMode = (setIsInEditMode: (editMode: boolean) => void): void => {
    setIsInEditMode(true);
};

interface EditProps {
    isInEditMode: boolean;
    row?: DbWikiRow;
}

export const EditModeDependentItem: React.FC<EditProps> = ({ isInEditMode: isInEditMode, row }) => {
    const [rowRef, setRowRef] = useState<DbWikiRow | undefined>(row);
    const [isInEditModeRef, setIsInEditModeRef] = useState(isInEditMode);
    return (
        <>
            {rowRef &&
                (!isInEditModeRef ? (
                    <DefaultWikiItemView rowRef={rowRef} setIsInEditModeRef={setIsInEditModeRef} />
                ) : (
                    <EditWikiItemView
                        rowRef={rowRef}
                        setRowRef={setRowRef}
                        setIsInEditModeRef={setIsInEditModeRef}
                    />
                ))}
        </>
    );
};
