import { useCallback, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import Button from "@mui/material/Button";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { Centerer } from "@/components/Modal/ModalFormStyles";

interface ResetTableButtonProps {
    resetTable: () => void;
}

const ResetTableButton = ({ resetTable }: ResetTableButtonProps): React.ReactElement => {
    const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState(false);

    const handleReset = useCallback(() => {
        resetTable();
        setIsConfirmationDialogVisible(false);
    }, [resetTable, setIsConfirmationDialogVisible]);

    return (
        <>
            <Button variant="contained" onClick={() => setIsConfirmationDialogVisible(true)}>
                Reset Table
            </Button>

            <Dialog open={isConfirmationDialogVisible}>
                <DialogTitle>Are you sure you want to reset the table?</DialogTitle>
                <DialogContent>
                    <DialogContentText>This will remove all data from the table.</DialogContentText>
                </DialogContent>
                <Centerer>
                    <DialogActions>
                        <Button onClick={() => setIsConfirmationDialogVisible(false)}>
                            Cancel
                        </Button>
                        <DeleteButton onClick={handleReset}>Reset</DeleteButton>
                    </DialogActions>
                </Centerer>
            </Dialog>
        </>
    );
};

export default ResetTableButton;
