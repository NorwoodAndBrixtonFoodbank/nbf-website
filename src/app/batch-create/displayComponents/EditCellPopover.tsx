import { Popover } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { BatchActionType } from "@/app/batch-create/batchTypes";
import { simulateEscapeKeyPress } from "@/app/batch-create/displayHelpers";

interface EditCellPopoverProps {
    id: number;
    field: string;
    cellValueString: string;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    children?: React.ReactNode;
}
const EditCellPopover: React.FC<EditCellPopoverProps> = ({
    id,
    field,
    cellValueString,
    children,
}) => {
    const apiRef = useGridApiContext();
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(null);
    const gridCellReference = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setPopoverAnchorEl(gridCellReference.current);
    }, []);

    const handleClose = (): void => {
        apiRef.current.setEditCellValue({
            id: id,
            field: field,
            value: cellValueString,
        });
        simulateEscapeKeyPress(gridCellReference);
    };

    // ensures that udpated state is displayed on the grid when tab or enter are pressed (both keys do not trigger onClose for popover)
    const handleKeyDown = (event: React.KeyboardEvent): void => {
        if (event.key === "Enter" || event.key === "Tab") {
            handleClose();
        }
    };

    return (
        <div ref={gridCellReference} onKeyDown={handleKeyDown}>
            <div>{cellValueString}</div>
            <Popover
                open={popoverAnchorEl !== null}
                onClose={handleClose}
                anchorEl={popoverAnchorEl?.parentElement}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {children}
            </Popover>
        </div>
    );
};

export default EditCellPopover;
